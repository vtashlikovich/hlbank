import { Inject, Injectable } from '@nestjs/common'
import { Customer } from './entities/customer.entity'

@Injectable()
export class CustomerService {
    constructor(
        @Inject('CUSTOMER_REPOSITORY')
        private customerRepository: typeof Customer
    ) {}

    findOne(uuid: string): Promise<Customer> {
        return this.customerRepository.findOne({
            where: {
                uuid,
            },
        })
    }
}
