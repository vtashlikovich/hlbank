import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
// import { CreateBlacklistDto } from './dto/create-blacklist.dto';
// import { UpdateBlacklistDto } from './dto/update-blacklist.dto';
import { Blacklist } from './entities/blacklist.entity';

export type BlacklistRecord = {
    bic: string | null;
    iban: string | null;
    bankaccount: string | null;
    sortcode: string | null;
};

@Injectable()
export class BlacklistService {
    constructor(
        @Inject('BLACKLIST_REPOSITORY')
        private blacklistRepository: typeof Blacklist
    ) {}

    // create(createBlacklistDto: CreateBlacklistDto) {
    //     return 'This action adds a new blacklist';
    // }

    // findAll() {
    // return `This action returns all blacklist`;
    // }

    async findOccurance(blacklistRecord: BlacklistRecord): Promise<number> {

        const orPart = [];

        if (blacklistRecord.bic)
            orPart.push({ bic: blacklistRecord.bic });
        if (blacklistRecord.iban)
            orPart.push({ iban: blacklistRecord.iban });
        if (blacklistRecord.bankaccount)
            orPart.push({ bankaccount: blacklistRecord.bankaccount });
        if (blacklistRecord.sortcode)
            orPart.push({ sortcode: blacklistRecord.sortcode });

        if (orPart.length == 0)
            return 0;
        else
            return await this.blacklistRepository.count({
                where: {
                    [Op.or]: orPart
                },
            });
    }

    // findOne(id: number) {
    // return `This action returns a #${id} blacklist`;
    // }

    // update(id: number, updateBlacklistDto: UpdateBlacklistDto) {
    // return `This action updates a #${id} blacklist`;
    // }

    // remove(id: number) {
    // return `This action removes a #${id} blacklist`;
    // }
}
