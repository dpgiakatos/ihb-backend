import { IsString, IsOptional } from 'class-validator';
// import { IsDateOnlyString } from 'src/helpers/date.decorator'

export class HospitalDate {
    year: number;

    month: number;

    day: number;
}

export class CreateHospitalBindings {
    @IsString()
    name: string;

    @IsString()
    city: string;

    @IsString()
    country: string;

    @IsString()
    cause: string;

    @IsString()
    description: string;

    // @IsDateOnlyString()
    @IsOptional()
    start: HospitalDate;

    // @IsDateOnlyString()
    @IsOptional()
    end: HospitalDate;
}
