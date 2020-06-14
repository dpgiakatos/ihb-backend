import { IsString, IsOptional, IsISO31661Alpha2, MaxLength } from 'class-validator';
import { IsDateOnlyString } from '../../../helpers/date.decorator'

export class HospitalBindings {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsString()
    @MaxLength(255)
    city: string;

    @IsString()
    @IsISO31661Alpha2()
    country: string;

    @IsString()
    @MaxLength(255)
    cause: string;

    @IsString()
    @MaxLength(255)
    treatment: string;

    @IsDateOnlyString()
    @IsOptional()
    starts: string;

    @IsDateOnlyString()
    @IsOptional()
    finishes: string;
}
