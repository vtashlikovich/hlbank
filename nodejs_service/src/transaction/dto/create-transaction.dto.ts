import {
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';
import { Currency } from 'src/account/currency.enum';

export class CreateTransactionDto {
    @IsOptional()
    @IsString()
    @MaxLength(25)
    uuid: string;

    @IsString()
    @MaxLength(25)
    @IsNotEmpty()
    customer_uid: string;

    @IsString()
    @MaxLength(25)
    @IsOptional()
    account_uid: string;

    @IsNumber()
    @IsNotEmpty()
    type: number;

    @IsEmpty()
    status: number;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    amount: number;

    @IsString()
    @MaxLength(3)
    @IsEnum(Currency)
    @IsOptional()
    currency: number;

    @IsEmpty()
    fee: number;

    @IsEmpty()
    party_amount: number;

    @IsString()
    @MaxLength(3)
    @IsEnum(Currency)
    @IsOptional()
    party_currency: number;

    @IsString()
    @MaxLength(25)
    @IsOptional()
    fx_rate_uid: number;

    @IsEmpty()
    fx_rate: number;

    @IsString()
    @MaxLength(14)
    @IsOptional()
    party_bic: string;

    @IsString()
    @MaxLength(40)
    @IsOptional()
    party_iban: string;

    @IsString()
    @MaxLength(30)
    @IsOptional()
    party_account_number: string;

    @IsString()
    @MaxLength(6)
    @IsOptional()
    party_sortcode: string;

    @IsString()
    @MaxLength(30)
    @IsOptional()
    party_bank: string;

    @IsString()
    @MaxLength(16)
    @IsOptional()
    party_bank_country: string;

    @IsNumber()
    @IsOptional()
    party_type: number;

    @IsString()
    @MaxLength(100)
    @IsOptional()
    party_name: string;

    @IsString()
    @MaxLength(16)
    @IsOptional()
    party_country: string;

    @IsString()
    @MaxLength(150)
    @IsOptional()
    party_address: string;

    @IsString()
    @MaxLength(10)
    @IsOptional()
    party_zipcode: string;

    @IsString()
    @MaxLength(30)
    @IsOptional()
    party_city: string;

    @IsString()
    @MaxLength(100)
    @IsOptional()
    party_contact: string;

    @IsString()
    @MaxLength(25)
    @IsOptional()
    party_phone: string;

    @IsString()
    @MaxLength(50)
    @IsOptional()
    party_email: string;

    @IsNumber()
    @IsOptional()
    account_to: number;

    @IsNumber()
    @IsOptional()
    account_from: number;

    @IsString()
    @MaxLength(10)
    @IsNotEmpty()
    provider: string;

    @IsString()
    @MaxLength(255)
    description: string;
}
