import { Module } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { Blacklist } from './entities/blacklist.entity';
import { DatabaseModule } from 'src/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [DatabaseModule, SequelizeModule.forFeature([Blacklist])],
    providers: [
        {
            provide: 'BLACKLIST_REPOSITORY',
            useValue: Blacklist,
        },
        BlacklistService,
    ],
    exports: [BlacklistService],
})
export class BlacklistModule {}
