import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from 'src/customer/customer.service';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
    let service: TransactionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TransactionService],
        })
        .useMocker((token) => {
            if (token === CustomerService) {
              return { findOne: jest.fn().mockResolvedValue({}) };
            }
          })
        .compile();

        service = module.get<TransactionService>(TransactionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
