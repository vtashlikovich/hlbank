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
        console.log('sending a mesage, type=', messageType);

        const record = new RmqRecordBuilder(newTransaction)
        .setOptions({
            headers: {
            ['x-version']: MQ_PROTOCOL_VERSION,
            },
            priority: 3,
        })
        .build();
        
        // just put to the queue
        return await this.publishService.emit(MessageTypes.NEW_TRANSACTION, record);

        // put to the queue and sibscribe to the processing events
        // return await this.publishService.send(MessageTypes.NEW_TRANSACTION, record)
        // .subscribe({next: console.log, error: console.error});

        // return await this.publishService.send(MessageTypes.NEW_TRANSACTION, record).toPromise()
    }
}

export enum MessageTypes {
    NEW_TRANSACTION = 'create-tx'
}