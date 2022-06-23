import { Test, TestingModule } from '@nestjs/testing';
import { FeeService, FEE_MIN } from './fee.service';

describe('FeeService', () => {
    let service: FeeService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FeeService],
        }).compile();

        service = module.get<FeeService>(FeeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('min fee', () => {
        expect(service.calculateFee(1000)).toBe(FEE_MIN);
    })

    it('10k fee', () => {
        expect(service.calculateFee(15000)).toBe(750);
    })

    it('100k fee', () => {
        expect(service.calculateFee(150000)).toBe(3750);
    })

    it('null', () => {
        expect(service.calculateFee(null)).toBe(null);
    })
});
