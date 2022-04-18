import { Inject, Injectable } from '@nestjs/common'
// import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity'
import { CreateAccountDto } from './dto/create-account.dto'
import uniqid from 'uniqid'
import { Op, Sequelize } from 'sequelize'

@Injectable()
export class AccountService {
    constructor(
        @Inject('ACCOUNT_REPOSITORY')
        private accountRepository: typeof Account
    ) {}

    create(createAccountDto: CreateAccountDto): Promise<Account> {
        return this.accountRepository.create({
            ...createAccountDto,
            uuid: uniqid('AA', createAccountDto.currency).toUpperCase(),
        })
    }

    findAll(): Promise<Account[]> {
        return this.accountRepository.findAll()
    }

    findOne(uuid: string): Promise<Account> {
        return this.accountRepository.findOne({
            where: {
                uuid,
            },
        })
    }

    updateBalance(account_uid: string, amount: number): Promise<[count: number]> {
        return this.accountRepository.update({
            onhold_balance: Sequelize.literal('onhold_balance + ' + amount),
            available_balance: Sequelize.literal('available_balance - ' + amount),
        }, {
            where: {
                uuid: account_uid,
                available_balance: {
                    [Op.gte]: amount
                }
            }
        });
    }

    // update(uuid: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    //     return `This action updates a #${uuid} account`;
    // }
}
