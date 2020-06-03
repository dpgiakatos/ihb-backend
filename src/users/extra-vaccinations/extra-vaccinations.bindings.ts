import { IsString, IsOptional } from 'class-validator';
import { IsDateOnlyString } from '../../helpers/date.decorator';

export class AddExtraVaccinationBindingModel {
    @IsString()
    name: string;

    @IsDateOnlyString()
    date: string;

    @IsString()
    description: string;
}

export class UpdateExtraVaccinationBindingModel {
    @IsString()
    @IsOptional()
    name?: string;

    @IsDateOnlyString()
    @IsOptional()
    date?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
