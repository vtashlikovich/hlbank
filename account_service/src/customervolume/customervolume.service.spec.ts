import { Test, TestingModule } from '@nestjs/testing';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { CustomervolumeService } from './customervolume.service';
import { Customervolume } from './entities/customervolume.entity';

const TEST_CUID = 'customerUID';
const TEST_MONTH = 202201;
const TEST_FAILED_MONTH = 202202;

describe('CustomerlimitService', () => {
    let service: CustomervolumeService;
    const customerLimit = {
        id: 1,
        customer_uid: 'customerUID',
        month: TEST_MONTH,
        volume: 10000
    };

    const mockedFindOne = jest.fn((options) => {
        if (options && options['where']) {
            const condition = options['where'];
            if (condition.customer_uid == TEST_CUID && condition.month == TEST_MONTH)
                return customerLimit;
        }
        
        return null;
    });

    const mockedCreate = jest.fn((options) => {
        return true;
    });
    const mockedUpdate = jest.fn((options) => {
        return true;
    });

    const mockedRepository = {
        findOne: mockedFindOne,
        create: mockedCreate,
        update: mockedUpdate,
    }

    const test_volumeTransaction = {
        id: 1,
        uuid: 'ui',
        customer_uid: 'ui',
        account_uid: 'ui',
        type: 1,
        status: 1,
        amount: 100,
        currency: 'USD',
        fee: 1,
        party_amount: 0,
        party_currency: 'USD',
        fx_rate_uid: '1',
        fx_rate: null,
        party_bic: 'test',
        party_iban: 'test',
        party_account_number: 'test',
        party_sortcode: 'test',
        party_bank: 'test',
        party_bank_country: 'test',
        party_type: 1,
        party_name:  'test',
        party_country:  'test',
        party_address:  'test',
        party_zipcode:  'test',
        party_city:  'test',
        party_contact:  'test',
        party_phone:  'test',
        party_email:  'test',
        account_to: 1,
        account_from: 1,
        provider: 'test',
        description: 'test',
        signature: 'test',
        commit: null,
        rollback: null,
        LOCK: null,
        afterCommit: null
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CustomervolumeService,
                {
                    provide: 'CUSTOMERLIMIT_REPOSITORY',
                    useValue: mockedRepository
                }],
        }).compile();

        service = module.get<CustomervolumeService>(CustomervolumeService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Find stats by customer month', async () => {
        expect(await service.findOneByCustomerMonth(TEST_CUID, TEST_MONTH)).toMatchObject(customerLimit);
    });

    it('Do not find stats by customer month', async () => {
        expect(await service.findOneByCustomerMonth(TEST_CUID, TEST_FAILED_MONTH)).toBeNull();
    });

    it('Create customer month volume', async () => {

        const createSpy = jest.spyOn(mockedRepository, 'create');
        const updateSpy = jest.spyOn(mockedRepository, 'update');
        const findOneSpy = jest.spyOn(mockedRepository, 'findOne');

        jest
            .useFakeTimers()
            .setSystemTime(new Date('2022-06-01'));
        
        await service.updateVolume(test_volumeTransaction, TEST_CUID, 1000);
        expect(findOneSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).toHaveBeenCalledTimes(1);
        expect(updateSpy).toHaveBeenCalledTimes(0);
    });

    it('Update customer month volume', async () => {

        const createSpy = jest.spyOn(mockedRepository, 'create');
        const updateSpy = jest.spyOn(mockedRepository, 'update');
        const findOneSpy = jest.spyOn(mockedRepository, 'findOne');
        
        jest
            .useFakeTimers()
            .setSystemTime(new Date('2022-01-01'));
        
        await service.updateVolume(test_volumeTransaction, TEST_CUID, 1000);
        expect(findOneSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).toHaveBeenCalledTimes(0);
        expect(updateSpy).toHaveBeenCalledTimes(1);
    });

});
