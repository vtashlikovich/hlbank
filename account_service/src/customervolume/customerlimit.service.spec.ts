import { Test, TestingModule } from '@nestjs/testing';
import { CustomervolumeService } from './customervolume.service';

describe('CustomerlimitService', () => {
    let serviceCustomervolumeServicece;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providCustomervolumeServiceervice],
        }).compile();

        service = module.CustomervolumeServiceviCustomervolumeServicevice);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
