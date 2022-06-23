import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    HttpStatus,
    Res
} from '@nestjs/common';
import { TransactionError, TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Response as ExpressResponse } from 'express';
import { ValidationResult } from './dto/validate-transaction.dto';
import { TransactionMessageDto } from './dto/message-transaction.dto';
import { MessageTypes, TransactionMQ6Service } from './transactionmq6.service';
import { Transaction } from './entities/transaction.entity';
import { ConfigService } from '@nestjs/config';

export const MQ_PROTOCOL_VERSION = '1.0';

@Controller('transaction')
export class Transaction6Controller {
    private producesMessage;

    constructor(
        private readonly transactionService: TransactionService,
        private readonly transactionMQService: TransactionMQ6Service,
        private readonly configService: ConfigService
        ) {
            this.producesMessage = configService.get<string>('REST_PRODUCES_MSG') == 'true';
        }

    @Post('/validate')
    async validate(
        @Res() httpResponse: ExpressResponse,
        @Body() createTransactionDto: CreateTransactionDto
    ): Promise<ExpressResponse> {
        let result: ValidationResult = null;

        const tick = new Date().getTime();
        console.time('timer' + tick);

        try {
            result = await this.transactionService.validate(
                createTransactionDto
            );
        } catch (error) {
            console.timeEnd('timer' + tick);
            return httpResponse.status(HttpStatus.CONFLICT).send({
                code: error.message,
            });
        }

        console.timeEnd('timer' + tick);
        return httpResponse.status(HttpStatus.OK).send(result);
    }

    @Post('/none')
    doNone() {
        return '';
    }

    @Post()
    async createTx(
        @Res() httpResponse: ExpressResponse,
        @Body() createTransactionDto: CreateTransactionDto
    ): Promise<ExpressResponse> {
        if (this.producesMessage)
            return await this.createViaMessage(httpResponse, createTransactionDto);
        else
            return await this.createViaREST(httpResponse, createTransactionDto);
    }

    async createViaMessage(
        @Res() httpResponse: ExpressResponse,
        @Body() createTransactionDto: CreateTransactionDto
    ): Promise<ExpressResponse> {

        let transactionUID: string = null;
 
        const tick = new Date().getTime();
        console.time('transaction' + tick);

        try {
            if (await this.transactionService.quickValidate(
                createTransactionDto
            )) {
                transactionUID = createTransactionDto.uuid;
                if (!transactionUID) {
                    transactionUID = this.transactionService.generateUID();
                    createTransactionDto.uuid = transactionUID;
                }

                const newTransaction: TransactionMessageDto = {version: MQ_PROTOCOL_VERSION, ...createTransactionDto};

                await this.transactionMQService.sendTransactionMessage(MessageTypes.NEW_TRANSACTION, newTransaction);
            }
        } catch (error) {
            if (error.message == TransactionError.DUPLICATION)
                return httpResponse.status(HttpStatus.CONFLICT).send('');
            else {
                console.debug(error);
                console.timeEnd('transaction' + tick);
                
                return httpResponse
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send({
                        error: error.message,
                    });
            }
        }
        console.timeEnd('transaction' + tick);

        return httpResponse.status(HttpStatus.OK).send({transactionuid: transactionUID});
    }

    async createViaREST(
        @Res() httpResponse: ExpressResponse,
        @Body() createTransactionDto: CreateTransactionDto
    ): Promise<ExpressResponse> {
        let result: Transaction = null;
        
        const tick = new Date().getTime();
        console.time('transaction' + tick);

        try {
            result = await this.transactionService.create(createTransactionDto);
        } catch (error) {
            if (error.message == TransactionError.DUPLICATION)
                return httpResponse.status(HttpStatus.CONFLICT).send('');
            else {
                console.debug(error);
                console.timeEnd('transaction' + tick);
                return httpResponse
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send({
                        error: error.message,
                    });
            }
        }
        console.timeEnd('transaction' + tick);

        return httpResponse.status(HttpStatus.OK).send(result);
    }

    @Get()
    findAll() {
        return this.transactionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transactionService.findOne(id);
    }
}
