import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { TransactionMessageDto } from './dto/message-transaction.dto';
import { MQ_PROTOCOL_VERSION } from './transaction.controller';

@Injectable()
export class TransactionMQService {
    constructor(
        @Inject('PUB_SERVICE') private publishService: ClientProxy,
    ) {}

    async sendTransactionMessage(messageType: MessageTypes, newTransaction: TransactionMessageDto) {
        console.log('sending a message, type=', messageType, '..');

        const record = new RmqRecordBuilder(newTransaction)
        .setOptions({
            headers: {
                ['x-version']: MQ_PROTOCOL_VERSION
            },
            priority: 3,
        })
        .build();

        // just put to the queue
        await this.publishService.emit(MessageTypes.NEW_TRANSACTION, record)

        console.log('..message created');
    }
}

export enum MessageTypes {
    NEW_TRANSACTION = 'create-tx'
}