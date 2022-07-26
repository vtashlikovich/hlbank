import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { TransactionMessageDto } from './dto/message-transaction.dto';
import { MQ_PROTOCOL_VERSION } from './transaction.controller';

@Injectable()
export class TransactionMQ6Service {
    constructor(
        @Inject('PUB1_SERVICE') private publishService1: ClientProxy,
        @Inject('PUB2_SERVICE') private publishService2: ClientProxy,
        @Inject('PUB3_SERVICE') private publishService3: ClientProxy,
        @Inject('PUB4_SERVICE') private publishService4: ClientProxy,
        @Inject('PUB5_SERVICE') private publishService5: ClientProxy,
        @Inject('PUB6_SERVICE') private publishService6: ClientProxy,
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

        // hash account uid, determine which group (out of 6) of values does it belong
        const queueIndex: number = this.hashFunction(newTransaction.account_uid);
        
        // put to the correct queue, one of 6
        let publishService: ClientProxy = this.publishService6;
        if (queueIndex == 1)
            publishService = this.publishService1;
        else if (queueIndex == 2)
            publishService = this.publishService2;
        else if (queueIndex == 3)
            publishService = this.publishService3;
        else if (queueIndex == 4)
            publishService = this.publishService4;
        else if (queueIndex == 5)
            publishService = this.publishService5;
            
        await publishService.emit(MessageTypes.NEW_TRANSACTION, record);

        console.log('..message created');
    }

    hashFunction(string2Hash: string): number {
        const asciiCode = string2Hash.length > 17?string2Hash.charCodeAt(18):0;

        if (48 <= asciiCode && asciiCode <= 53)
            return 1;
        else if (54 <= asciiCode && asciiCode <= 57 || asciiCode == 65 || asciiCode == 66)
            return 2;
        else if (67 <= asciiCode && asciiCode <= 72)
            return 3;
        else if (73 <= asciiCode && asciiCode <= 78)
            return 4;
        else if (79 <= asciiCode && asciiCode <= 84)
            return 5;
        else
            return 6;
    }
}

export enum MessageTypes {
    NEW_TRANSACTION = 'create-tx'
}