import { Module } from '@nestjs/common'
import { CustomerlimitService } from './customerlimit.service'
import { CustomerlimitController } from './customerlimit.controller'
import { Customerlimit } from './entities/customerlimit.entity'
import { DatabaseModule } from 'src/database/database.module'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
    imports: [DatabaseModule, SequelizeModule.forFeature([Customerlimit])],
    controllers: [CustomerlimitController],
    providers: [
        {
            provide: 'CUSTOMERLIMIT_REPOSITORY',
            useValue: Customerlimit,
        },
        CustomerlimitService,
    ],
    exports: [CustomerlimitService],
})
export class CustomerlimitModule {}
