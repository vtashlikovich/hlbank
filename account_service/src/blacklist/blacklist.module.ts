import { Module } from '@nestjs/common'
import { BlacklistService } from './blacklist.service'
import { BlacklistController } from './blacklist.controller'
import { Blacklist } from './entities/blacklist.entity'
import { DatabaseModule } from 'src/database/database.module'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
    imports: [DatabaseModule, SequelizeModule.forFeature([Blacklist])],
    controllers: [BlacklistController],
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
