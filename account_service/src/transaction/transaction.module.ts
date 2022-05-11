import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entities/transaction.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from 'src/database/database.module';
import { CustomerModule } from 'src/customer/customer.module';
import { CustomervolumeModule } from 'src/customervolume/customervolume.module';
import { BlacklistModule } from 'src/blacklist/blacklist.module';
import { AccountModule } from 'src/account/account.module';
import { FeeModule } from 'src/fee/fee.module';
import { Sequelize } from 'sequelize-typescript';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionMQService } from './transactionmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionMQController } from './transactionmq.controller';

@Module({
    imports: [
        DatabaseModule,
        SequelizeModule.forFeature([Transaction]),
        ConfigModule,
        AccountModule,
        CustomerModule,
        CustomervolumeModule,
        BlacklistModule,
        FeeModule,
        ClientsModule.registerAsync([
            {
                name: 'PUB_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => (
                    configService.get<string>('MQ_PRODUCER') == 'true'?{
                    transport: Transport.RMQ,
                    options: {
                        queue: configService.get<string>('RABBIT_QUEUE'),
                        urls: [configService.get<string>('RABBIT_URL')],
                        noAck: false,
                        queueOptions: { durable: false }
                    },
                }:{}),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [TransactionController, TransactionMQController],
    providers: [
        {
            provide: 'TX_REPOSITORY',
            useValue: Transaction,
        },
        {
            provide: 'SEQUELIZE',
            useExisting: Sequelize,
        },
        TransactionService,
        TransactionMQService,
    ],
    exports: [TransactionService, TransactionMQService],
})
export class TransactionModule {}
