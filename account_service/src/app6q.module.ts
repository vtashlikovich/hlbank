import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { AccountModule } from './account/account.module';
import { CustomerModule } from './customer/customer.module';
import { CustomervolumeModule } from './customervolume/customervolume.module';
import { BlacklistModule } from './blacklist/blacklist.module';
import { FeeModule } from './fee/fee.module';
import { Transaction6QModule } from './transaction/transaction6q.module';

@Module({
    imports: [
        SwaggerModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        CustomerModule,
        AccountModule,
        Transaction6QModule,
        CustomervolumeModule,
        BlacklistModule,
        FeeModule,
    ],
    providers: [AppService]
})
export class App6QModule {}
