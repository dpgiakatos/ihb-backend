import { IsString, IsOptional, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';


export class CreatePersonalBindings {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    @IsOptional()
    ssnvs: string;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    birthDate: Date;
    
    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    fatherFirstName: string;

    @IsString()
    @IsOptional()
    fatherLastName: string;

    @IsString()
    @IsOptional()
    motherFirstName: string;

    @IsString()
    @IsOptional()
    motherLastName: string;

    @IsString()
    @IsOptional()
    mobilePhone: string;

    @IsString()
    @IsOptional()
    emergencyContact: string;
}

export class UpdatePersonalBindings {
    @IsString()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsString()
    @IsOptional()
    ssnvs: string;

    @Transform(value => new Date(value))
    @IsDate()
    @IsOptional()
    birthDate: Date;
    
    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    fatherFirstName: string;

    @IsString()
    @IsOptional()
    fatherLastName: string;

    @IsString()
    @IsOptional()
    motherFirstName: string;

    @IsString()
    @IsOptional()
    motherLastName: string;

    @IsString()
    @IsOptional()
    mobilePhone: string;

    @IsString()
    @IsOptional()
    emergencyContact: string;
}

