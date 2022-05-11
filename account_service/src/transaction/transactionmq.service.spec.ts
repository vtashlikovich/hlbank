import { Test, TestingModule } from '@nestjs/testing';
import { TransactionmqService } from './transactionmq.service';

describe('TransactionmqService', () => {
  let service: TransactionmqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionmqService],
    }).compile();

    service = module.get<TransactionmqService>(TransactionmqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
