import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { DatabaseModule } from 'src/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from './entities/account.entity';

@Module({
    imports: [DatabaseModule, SequelizeModule.forFeature([Account])],
    controllers: [AccountController],
    providers: [
        {
            provide: 'ACCOUNT_REPOSITORY',
            useValue: Account,
        },
        AccountService,
    ],
    exports: [AccountService],
})
export class AccountModule {}
