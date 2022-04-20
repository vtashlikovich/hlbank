import { Test, TestingModule } from '@nestjs/testing';
import { CustomervolumeController } from './customervolume.controller';
import { CustomervolumeService } from './customervolume.service';

describe('CustomerlimitController', () => {
    let controllerCustomervolumeControllerer;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllCustomervolumeControllerroller],
            providers: [CustomervolumeService],
        }).compile();

        controller = module.CustomervolumeControllerllCustomervolumeController
            CustomerlimitController
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
