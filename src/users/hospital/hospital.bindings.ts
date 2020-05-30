import { IsString, IsOptional } from 'class-validator';
import { IsDateOnlyString } from '../../helpers/date.decorator'

export class HospitalBindings {
    @IsString()
    name: string;

    @IsString()
    city: string;

    @IsString()
    country: string;

    @IsString()
    cause: string;

    @IsString()
    treatment: string;

    @IsDateOnlyString()
    @IsOptional()
    starts: string;

    @IsDateOnlyString()
    @IsOptional()
    finishes: string;
}
