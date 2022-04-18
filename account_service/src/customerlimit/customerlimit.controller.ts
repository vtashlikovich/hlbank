import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common'
import { CustomerlimitService } from './customerlimit.service'
// import { CreateCustomerlimitDto } from './dto/create-customerlimit.dto';
// import { UpdateCustomerlimitDto } from './dto/update-customerlimit.dto';

@Controller('customerlimit')
export class CustomerlimitController {
    constructor(private readonly customerlimitService: CustomerlimitService) {}

    //   @Post()
    //   create(@Body() createCustomerlimitDto: CreateCustomerlimitDto) {
    //     return this.customerlimitService.create(createCustomerlimitDto);
    //   }

    //   @Get()
    //   findAll() {
    //     return this.customerlimitService.findAll();
    //   }

    //   @Get(':id')
    //   findOne(@Param('id') id: string) {
    //     return this.customerlimitService.findOne(+id);
    //   }

    //   @Patch(':id')
    //   update(@Param('id') id: string, @Body() updateCustomerlimitDto: UpdateCustomerlimitDto) {
    //     return this.customerlimitService.update(+id, updateCustomerlimitDto);
    //   }

    //   @Delete(':id')
    //   remove(@Param('id') id: string) {
    //     return this.customerlimitService.remove(+id);
    //   }
}
