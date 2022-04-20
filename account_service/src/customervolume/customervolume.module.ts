import { Module } from '@nestjs/common';
import { CustomervolumeService } from './customervolume.service';
import { CustomervolumeController } from './customervolume.controller';
import { Customervolume } from './entities/customervolume.entity';
import { DatabaseModule } from 'src/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [DatabaseModule, SequelizeModule.forFeature([Customervolume])],
    controllers: [CustomervolumeController],
    providers: [
        {
            provide: 'CUSTOMERLIMIT_REPOSITORY',
            useValue: Customervolume,
        },
        CustomervolumeService,
    ],
    exports: [CustomervolumeService],
})
export class CustomervolumeModule {}
