import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { DatabaseModule } from 'src/database/database.module'
import { CustomerService } from './customer.service'
import { Customer } from './entities/customer.entity'

@Module({
    imports: [DatabaseModule, SequelizeModule.forFeature([Customer])],
    providers: [
        {
            provide: 'CUSTOMER_REPOSITORY',
            useValue: Customer,
        },
        CustomerService,
    ],
    exports: [CustomerService],
})
export class CustomerModule {}
