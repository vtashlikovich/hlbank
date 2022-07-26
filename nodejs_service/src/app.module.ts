import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { CustomerModule } from './customer/customer.module';
import { CustomervolumeModule } from './customervolume/customervolume.module';
import { BlacklistModule } from './blacklist/blacklist.module';
import { FeeModule } from './fee/fee.module';

@Module({
    imports: [
        SwaggerModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        CustomerModule,
        AccountModule,
        TransactionModule,
        CustomervolumeModule,
        BlacklistModule,
        FeeModule,
    ],
    providers: [AppService]
})
export class AppModule {}
