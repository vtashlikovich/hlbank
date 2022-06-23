import { Test, TestingModule } from '@nestjs/testing';
import { Op } from 'sequelize';
import { BlacklistRecord, BlacklistService } from './blacklist.service';

describe('BlacklistService', () => {
    let service: BlacklistService;

    const recordPositive: BlacklistRecord = {
        bic: 'ABC',
        iban: null,
        bankaccount: null,
        sortcode: null
    };

    const recordEmpty: BlacklistRecord = {
        bic: null,
        iban: null,
        bankaccount: null,
        sortcode: null
    };

    const recordNegative: BlacklistRecord = {
        bic: 'BCD',
        iban: null,
        bankaccount: 'BACC',
        sortcode: null
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BlacklistService,
                {
                    provide: 'BLACKLIST_REPOSITORY',
                    useValue: {
                        count: jest.fn((options) => {
                            let recordsFound = 0;

                            if (options != null) {
                                const whereStruct = options['where'];
                                const conditionStruct = options['where'][Op.or];

                                if (whereStruct != null && conditionStruct != null && conditionStruct.length > 0) {
                                    const filteredCase1 = conditionStruct.filter((val) => val.bic == 'ABC');
                                    const filteredCase2 = conditionStruct.filter((val) => 
                                        val.bic == null || val.iban == null || val.bankaccount == null || val.sortcode == null);
                                    const filteredCase3 = conditionStruct.filter((val) => val.bic == 'BCD' || val.bankaccount == 'BACC');

                                    if (filteredCase1 && filteredCase1.length == 1)
                                        recordsFound = 1;
                                    else if (filteredCase2 && filteredCase2.length == 4)
                                        recordsFound = 0;
                                    else if (filteredCase3 && filteredCase3.length == 2)
                                        recordsFound = 0;
                                }
                            }
                            return recordsFound;
                        })
                    },
                }
            ],
        }).compile();

        service = module.get<BlacklistService>(BlacklistService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Check positive search', async () => {
        expect(await service.findOccurance(recordPositive)).toBe(1);
    });

    it('Check negative search', async () => {
        expect(await service.findOccurance(recordNegative)).toBe(0);
    });

    it('Check empty search criteria', async () => {
        expect(await service.findOccurance(recordEmpty)).toBe(0);
    });
});
