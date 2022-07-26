import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionMQController } from './transactionmq.controller';
import { TransactionMQ6Service } from './transactionmq6.service';
import { Transaction6Controller } from './transaction6.controller';

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
                name: 'PUB1_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => (
                    configService.get<string>('REST_PRODUCES_MSG') == 'true'?{
                    transport: Transport.RMQ,
                    options: {
                        queue: configService.get<string>('RABBIT_QUEUE1'),
                        urls: [configService.get<string>('RABBIT_URL')],
                        noAck: false,
                        queueOptions: { durable: false }
                    },
                }:{}),
                inject: [ConfigService],
            },
        ]),
        ClientsModule.registerAsync([
            {
                name: 'PUB2_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => (
                    configService.get<string>('REST_PRODUCES_MSG') == 'true'?{
                    transport: Transport.RMQ,
                    options: {
                        queue: configService.get<string>('RABBIT_QUEUE2'),
                        urls: [configService.get<string>('RABBIT_URL')],
                        noAck: false,
                        queueOptions: { durable: false }
                    },
                }:{}),
                inject: [ConfigService],
            },
        ]),
        ClientsModule.registerAsync([
            {
                name: 'PUB3_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => (
                    configService.get<string>('REST_PRODUCES_MSG') == 'true'?{
                    transport: Transport.RMQ,
                    options: {
                        queue: configService.get<string>('RABBIT_QUEUE3'),
                        urls: [configService.get<string>('RABBIT_URL')],
                        noAck: false,
                        queueOptions: { durable: false }
                    },
                }:{}),
                inject: [ConfigService],
            },
        ]),
        ClientsModule.registerAsync([
            {
                name: 'PUB4_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => (
                    configService.get<string>('REST_PRODUCES_MSG') == 'true'?{
                    transport: Transport.RMQ,
                    options: {
                        queue: configService.get<string>('RABBIT_QUEUE4'),
                        urls: [configService.get<string>('RABBIT_URL')],
                        noAck: false,
                        queueOptions: { durable: false }
                    },
                }:{}),
                inject: [ConfigService],
            },
        ]),
        ClientsModule.registerAsync([
            {
                name: 'PUB5_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => (
                    configService.get<string>('REST_PRODUCES_MSG') == 'true'?{
                    transport: Transport.RMQ,
                    options: {
                        queue: configService.get<string>('RABBIT_QUEUE5'),
                        urls: [configService.get<string>('RABBIT_URL')],
                        noAck: false,
                        queueOptions: { durable: false }
                    },
                }:{}),
                inject: [ConfigService],
            },
        ]),
        ClientsModule.registerAsync([
            {
                name: 'PUB6_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => (
                    configService.get<string>('REST_PRODUCES_MSG') == 'true'?{
                    transport: Transport.RMQ,
                    options: {
                        queue: configService.get<string>('RABBIT_QUEUE6'),
                        urls: [configService.get<string>('RABBIT_URL')],
                        noAck: false,
                        queueOptions: { durable: false }
                    },
                }:{}),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [Transaction6Controller, TransactionMQController],
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
        TransactionMQ6Service,
    ],
    exports: [TransactionService, TransactionMQ6Service],
})
export class Transaction6QModule {}
