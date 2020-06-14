import { IsString, IsOptional, MaxLength } from 'class-validator';
import { IsDateOnlyString } from '../../../helpers/date.decorator';

export class AddExtraVaccinationBindingModel {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsDateOnlyString()
    date: string;

    @IsString()
    description: string;
}

export class UpdateExtraVaccinationBindingModel {
    @IsString()
    @MaxLength(255)
    @IsOptional()
    name?: string;

    @IsDateOnlyString()
    @IsOptional()
    date?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    description?: string;
}
