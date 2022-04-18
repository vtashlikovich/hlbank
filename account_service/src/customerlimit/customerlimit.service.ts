import { Inject, Injectable } from '@nestjs/common'
// import { CreateCustomerlimitDto } from './dto/create-customerlimit.dto';
// import { UpdateCustomerlimitDto } from './dto/update-customerlimit.dto';
import { Customerlimit } from './entities/customerlimit.entity'

@Injectable()
export class CustomerlimitService {
    constructor(
        @Inject('CUSTOMERLIMIT_REPOSITORY')
        private limitRepository: typeof Customerlimit
    ) {}

    //   create(createCustomerlimitDto: CreateCustomerlimitDto) {
    //     return 'This action adds a new customerlimit';
    //   }

    //   findAll() {
    //     return `This action returns all customerlimit`;
    //   }

    findOneByCustomerMonth(customer_uid: string, month: number) {
        return this.limitRepository.findOne({
            where: {
                customer_uid,
                month,
            },
        })
    }

    //   update(id: number, updateCustomerlimitDto: UpdateCustomerlimitDto) {
    //     return `This action updates a #${id} customerlimit`;
    //   }

    //   remove(id: number) {
    //     return `This action removes a #${id} customerlimit`;
    //   }
}
