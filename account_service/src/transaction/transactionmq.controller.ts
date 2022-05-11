import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { TransactionMessageDto } from './dto/message-transaction.dto';
import { MQ_PROTOCOL_VERSION } from './transaction.controller';
import { TransactionError, TransactionService } from './transaction.service';
import { MessageTypes } from './transactionmq.service';

@Controller()
export class TransactionMQController {
    constructor(
        private readonly transactionService: TransactionService
        ) {}

    @MessagePattern(MessageTypes.NEW_TRANSACTION)
    public async processCreateTransactionMessage(@Payload() newTransaction: TransactionMessageDto, 
        @Ctx() context: RmqContext) {

        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();

        if (!newTransaction.uuid)
            newTransaction.uuid = this.transactionService.generateUID();

        console.log(`>>>>> Got a new transaction from the incoming queue: ${newTransaction.uuid}`);

        const { properties: { headers } } = orginalMessage;

        if (headers['x-version'] !== MQ_PROTOCOL_VERSION)
            console.warn('message version ', headers['x-version'], ' is NOT supported');
        
        let saveErrorTransaction = false;
        try {
            await this.transactionService.create(newTransaction);
            channel.ack(orginalMessage);
        }
        catch (error) {
            console.error(`Problem while saving a transaction ${newTransaction.uuid} from the queue`, error);
            saveErrorTransaction = error.message in TransactionError;
            if (error.message == TransactionError.DUPLICATION) {
                console.warn(`Duplicated transaction has been detected from the queue. Rejecting`);
                channel.ack(orginalMessage);
                saveErrorTransaction = false;
            }
            else if (!saveErrorTransaction) {
                console.error(`transaction ${newTransaction.uuid} error is not recognized, getting back to the queue`);
                channel.nack(orginalMessage);
            }
        }

        if (saveErrorTransaction) {
            try {
                console.error(`saving transaction ${newTransaction.uuid} with ERROR state`);
                // TODO: save the reason of the transaction error
                await this.transactionService.createTransactionWithError(newTransaction);
                channel.ack(orginalMessage);
            }
            catch (error) {
                console.error(`Error saving transaction ${newTransaction.uuid} with ERROR state`);
                channel.nack(orginalMessage);
            }
        }
    }
}
