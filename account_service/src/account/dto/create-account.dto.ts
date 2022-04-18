import {
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator'
import { Currency } from '../currency.enum'

export class CreateAccountDto {
    @IsOptional()
    @IsString()
    @MaxLength(35)
    uuid: string

    @IsNumber()
    @IsNotEmpty()
    customer_id: number

    @IsEmpty()
    status: number

    @IsString()
    @MaxLength(50)
    label: string

    @IsString()
    @MaxLength(3)
    @IsEnum(Currency)
    currency: string

    @IsNumber()
    @IsNotEmpty()
    bank_id: number

    @IsString()
    @MaxLength(35)
    @IsOptional()
    iban: string

    @IsString()
    @MaxLength(30)
    @IsOptional()
    account_number: string

    @IsString()
    @MaxLength(6)
    @IsOptional()
    sort_code: string
}
