import { Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { TransactionController } from './transaction.controller'
import { Transaction } from './entities/transaction.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { DatabaseModule } from 'src/database/database.module'
import { CustomerModule } from 'src/customer/customer.module'
import { CustomerlimitModule } from 'src/customerlimit/customerlimit.module'
import { BlacklistModule } from 'src/blacklist/blacklist.module'
import { AccountModule } from 'src/account/account.module'
import { FeeModule } from 'src/fee/fee.module'

@Module({
    imports: [
        DatabaseModule,
        SequelizeModule.forFeature([Transaction]),
        AccountModule,
        CustomerModule,
        CustomerlimitModule,
        BlacklistModule,
        FeeModule,
    ],
    controllers: [TransactionController],
    providers: [
        {
            provide: 'TX_REPOSITORY',
            useValue: Transaction,
        },
        TransactionService,
    ],
    exports: [TransactionService],
})
export class TransactionModule {}
