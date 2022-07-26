import { Test, TestingModule } from '@nestjs/testing';
import { TransactionMQService } from './transactionmq.service';

describe('TransactionmqService', () => {
  let service: TransactionMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionMQService],
    }).compile();

    service = module.get<TransactionMQService>(TransactionMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
