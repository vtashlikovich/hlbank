import { PartialType } from '@nestjs/swagger';
import { CreateCustomerlimitDto } from './create-customerlimit.dto';

export class UpdateCustomerlimitDto extends PartialType(
    CreateCustomerlimitDto
) {}
