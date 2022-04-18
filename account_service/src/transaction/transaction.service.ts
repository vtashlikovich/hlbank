import { Inject, Injectable } from '@nestjs/common'
import uniqid from 'uniqid'
import { CreateTransactionDto } from './dto/create-transaction.dto'
// import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { Transaction } from './entities/transaction.entity'
import { Transaction as TransactionSeq } from 'sequelize';
import objectHash = require('object-hash')
import { CustomerService } from 'src/customer/customer.service'
import { Customer } from 'src/customer/entities/customer.entity'
import { Account } from 'src/account/entities/account.entity'
import { AccountService } from 'src/account/account.service'
import { Customerlimit } from 'src/customerlimit/entities/customerlimit.entity'
import { CustomerlimitService } from 'src/customerlimit/customerlimit.service'
import { FeeService } from 'src/fee/fee.service'
import {
    BlacklistRecord,
    BlacklistService,
} from 'src/blacklist/blacklist.service'
import { ValidationResult } from './dto/validate-transaction.dto'
import { Sequelize } from 'sequelize'

export enum TransactionStatus {
    INIT = 1,
    PROCESSING = 5,
    ERROR = 10,
    DONE = 20,
    CANCELLED = 30
}

@Injectable()
export class TransactionService {
    constructor(
        @Inject('TX_REPOSITORY')
        private txRepository: typeof Transaction,
        private customerService: CustomerService,
        private accountService: AccountService,
        private customerLimitService: CustomerlimitService,
        private feeService: FeeService,
        private blacklistService: BlacklistService,
        
        @Inject('SEQUELIZE')
        private readonly sequelizeInstance: Sequelize,
    ) {}

    async validate(
        createTransactionDto: CreateTransactionDto
    ): Promise<ValidationResult> {
        const txSignature = this.createSignature(createTransactionDto)
        const fee = this.feeService.calculateFee(createTransactionDto.amount)
        const result = await this.validateWithSignatureAndFee(
            createTransactionDto,
            txSignature,
            fee
        )
        if (result)
            return {
                fee,
            }
        else return null
    }

    async validateWithSignatureAndFee(
        createTransactionDto: CreateTransactionDto,
        txSignature: string,
        fee: number
    ): Promise<boolean> {
        const customer: Customer = await this.customerService.findOne(
            createTransactionDto.customer_uid
        )
        const account: Account = await this.accountService.findOne(
            createTransactionDto.account_uid
        )

        if (!(await this.checkIfCustomerEnabled(customer)))
            throw new Error(TransactionError.USER_BLOCKED)

        if (!(await this.checkIfAccountEnabled(account)))
            throw new Error(TransactionError.ACCOUNT_BLOCKED)

        if (
            await this.checkIfTransactionLimitHit(
                customer,
                createTransactionDto.amount + fee
            )
        )
            throw new Error(TransactionError.LIMIT_HIT)

        if (
            await this.checkIfPayeeBlacklisted({
                bic: createTransactionDto.party_bic,
                iban: createTransactionDto.party_iban,
                bankaccount:
                    createTransactionDto.party_bank +
                    createTransactionDto.party_account_number,
                sortcode: createTransactionDto.party_sortcode,
            })
        )
            throw new Error(TransactionError.PAYEE_BLACKLIST)

        if (
            !(await this.checkIfAccountBalanceAvailable(
                account,
                createTransactionDto.amount + fee
            ))
        )
            throw new Error(TransactionError.INSUFFICIENT_FUNDS)

        if (!(await this.checkIfIdempotent(txSignature)))
            throw new Error(TransactionError.DUPLICATION)

        return true
    }

    async create(
        createTransactionDto: CreateTransactionDto
    ): Promise<Transaction> {
        const txSignature = this.createSignature(createTransactionDto)
        const fee = this.feeService.calculateFee(createTransactionDto.amount)
        let transactionObject: Transaction = null;

        try {
            if (
                await this.validateWithSignatureAndFee(
                    createTransactionDto,
                    txSignature,
                    fee
                )
            ) {

                // generate UUID if not yet set up
                let uuid: string = createTransactionDto.uuid;
                if (!uuid)
                    uuid = uniqid('TR').toUpperCase();

                const transaction: TransactionSeq = await this.sequelizeInstance.transaction({
                    logging: true,  // Just for debugging purposes
                });
                    
                transactionObject = await this.txRepository.create({
                    ...createTransactionDto,
                    fee,
                    uuid,
                    signature: txSignature,
                }, {
                    transaction
                });

                if (transactionObject) {

                    try {
                        // update balance, where amount >= amount + fee
                        await this.accountService.updateBalance(transaction, createTransactionDto.account_uid, createTransactionDto.amount + fee);

                        // update monthly limit
                        await this.customerLimitService.updateLimit(transaction, createTransactionDto.customer_uid, createTransactionDto.amount + fee);

                        transaction.commit();
                    } catch(updateError) {
                        console.debug(`Amount fixation error for account ${createTransactionDto.account_uid}: `, updateError);
                        transaction.rollback();

                        throw new Error(TransactionError.INTERNAL);
                    }
                }
                else
                    transaction.commit();
            }
        } catch (error) {
            console.debug('Cannot validate or insert a new tranaction: ' + error);
            throw new Error(error);
        }

        return transactionObject;
    }

    updateStatus(uuid: string, status: TransactionStatus): Promise<[count: number]> {
        return this.txRepository.update({
            status
        }, {
            where: {
                uuid
            }
        });
    }

    findAll(): Promise<Transaction[]> {
        return this.txRepository.findAll()
    }

    findOne(uuid: string): Promise<Transaction> {
        return this.txRepository.findOne({
            where: {
                uuid,
            },
        })
    }

    createSignature(createTransactionDto: CreateTransactionDto): string {
        const timeStamp = new Date().toISOString().split('T')

        const bean4hashing = {
            customer_uid: createTransactionDto.customer_uid,
            account_uid: createTransactionDto.account_uid,
            type: createTransactionDto.type,
            amount: createTransactionDto.amount,
            currency: createTransactionDto.currency,
            party_currency: createTransactionDto.party_currency,
            fx_rate_uid: createTransactionDto.fx_rate_uid,
            party_bic: createTransactionDto.party_bic,
            party_iban: createTransactionDto.party_iban,
            party_account_number: createTransactionDto.party_account_number,
            party_sortcode: createTransactionDto.party_sortcode,
            party_bank: createTransactionDto.party_bank,
            party_type: createTransactionDto.party_type,
            party_name: createTransactionDto.party_name,
            party_contact: createTransactionDto.party_contact,
            party_phone: createTransactionDto.party_phone,
            party_email: createTransactionDto.party_email,
            account_to: createTransactionDto.account_to,
            provider: createTransactionDto.provider,
            date: timeStamp[0] + timeStamp[1].substring(0, 4),
        }

        return objectHash(bean4hashing)
    }

    async checkIfIdempotent(signature: string): Promise<boolean> {
        const recordsNum = await this.txRepository.count({
            where: {
                signature,
            },
        })

        return recordsNum == 0
    }

    async checkIfCustomerEnabled(customer: Customer): Promise<boolean> {
        return customer && customer.enabled
    }

    async checkIfAccountEnabled(account: Account): Promise<boolean> {
        return account && account.enabled
    }

    async checkIfTransactionLimitHit(
        customer: Customer,
        amount: number
    ): Promise<boolean> {
        let limitHit = false

        const currentDate = new Date()
        const currentYearMonth =
            currentDate.getFullYear() * 100 + currentDate.getMonth() + 1
        const monthlyLimit: Customerlimit =
            await this.customerLimitService.findOneByCustomerMonth(
                customer.uuid,
                currentYearMonth
            )

        if (monthlyLimit && monthlyLimit.volume)
            limitHit = monthlyLimit.volume + amount >= customer.monthly_limit

        return limitHit
    }

    async checkIfPayeeBlacklisted(
        blacklistRecord: BlacklistRecord
    ): Promise<boolean> {
        return (await this.blacklistService.findOccurance(blacklistRecord)) > 0
    }

    async checkIfAccountBalanceAvailable(
        account: Account,
        amount: number
    ): Promise<boolean> {
        return account && account.available_balance >= amount
    }
}

export enum TransactionError {
    INTERNAL = 'INTERNAL_ERROR',
    DUPLICATION = 'DUPLICATION',
    USER_BLOCKED = 'USER_BLOCKED',
    ACCOUNT_BLOCKED = 'ACCOUNT_BLOCKED',
    INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
    LIMIT_HIT = 'LIMIT_HIT',
    PAYEE_BLACKLIST = 'PAYEE_BLACKLIST',
}
