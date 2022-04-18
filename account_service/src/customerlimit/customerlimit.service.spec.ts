import { Test, TestingModule } from '@nestjs/testing'
import { CustomerlimitService } from './customerlimit.service'

describe('CustomerlimitService', () => {
    let service: CustomerlimitService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CustomerlimitService],
        }).compile()

        service = module.get<CustomerlimitService>(CustomerlimitService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
