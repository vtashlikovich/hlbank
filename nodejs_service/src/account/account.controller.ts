import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
// import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post()
    create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
        return this.accountService.create(createAccountDto);
    }

    @Get()
    findAll(): Promise<Account[]> {
        return this.accountService.findAll();
    }

    @Get(':uuid')
    findOne(@Param('uuid') uuid: string): Promise<Account> {
        return this.accountService.findOne(uuid);
    }

    //   @Patch(':id')
    //   update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    //     return this.accountService.update(id, updateAccountDto);
    //   }
}
