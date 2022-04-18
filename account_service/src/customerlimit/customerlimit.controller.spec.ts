import { Test, TestingModule } from '@nestjs/testing'
import { CustomerlimitController } from './customerlimit.controller'
import { CustomerlimitService } from './customerlimit.service'

describe('CustomerlimitController', () => {
    let controller: CustomerlimitController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CustomerlimitController],
            providers: [CustomerlimitService],
        }).compile()

        controller = module.get<CustomerlimitController>(
            CustomerlimitController
        )
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
