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
import { ConfigModule } from '@nestjs/config';

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
    ],
    controllers: [TransactionController],
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
    ],
    exports: [TransactionService],
})
export class TransactionModule {}
