import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// import { CreateCustomerlimitDto } from './dto/create-customerlimit.dto';
// import { UpdateCustomerlimitDto } from './dto/update-customerlimit.dto';
import { Customervolume } from './entities/customervolume.entity';

@Injectable()
export class CustomervolumeService {
    constructor(
        @Inject('CUSTOMERLIMIT_REPOSITORY')
        private limitRepository: typeof Customervolume
    ) {}

    //   create(createCustomerlimitDto: CreateCustomerlimitDto) {
    //     return 'This action adds a new customerlimit';
    //   }

    //   findAll() {
    //     return `This action returns all customerlimit`;
    //   }

    findOneByCustomerMonth(
        customer_uid: string,
        month: number
    ): Promise<Customervolume> {
        return this.limitRepository.findOne({
            where: {
                customer_uid,
                month,
            },
        });
    }

    async updateVolume(
        transaction: Transaction,
        customer_uid: string,
        amount: number
    ): Promise<boolean> {
        const currentDate = new Date();
        const currentYearMonth =
            currentDate.getFullYear() * 100 + currentDate.getMonth() + 1;

        const existingLimit: Customervolume = await this.findOneByCustomerMonth(
            customer_uid,
            currentYearMonth
        );
        if (!existingLimit) {
            await this.limitRepository.create(
                {
                    customer_uid,
                    volume: amount,
                    month: currentYearMonth,
                },
                {
                    transaction,
                }
            );
        } else
            await this.limitRepository.update(
                {
                    volume: Sequelize.literal('volume + ' + amount),
                },
                {
                    where: {
                        customer_uid,
                        month: currentYearMonth,
                    },
                    transaction,
                }
            );

        return true;
    }

    //   update(id: number, updateCustomerlimitDto: UpdateCustomerlimitDto) {
    //     return `This action updates a #${id} customerlimit`;
    //   }

    //   remove(id: number) {
    //     return `This action removes a #${id} customerlimit`;
    //   }
}
