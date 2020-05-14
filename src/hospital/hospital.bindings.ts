import { IsString, IsOptional, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';


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

    @Type(() => Date)
    @IsDate()
    start: Date;

    @Type(() => Date)
    @IsDate()
    end: Date;
}

export class UpdateHospitalBindings {
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

    @Type(() => Date)
    @IsDate()
    start: Date;

    @Type(() => Date)
    @IsDate()
    end: Date;
}