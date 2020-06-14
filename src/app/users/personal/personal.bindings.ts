import { IsString, IsOptional, MaxLength, IsISO31661Alpha2 } from 'class-validator';
import { IsDateOnlyString } from '../../../helpers/date.decorator';


export class CreatePersonalBindings {
    @IsString()
    @MaxLength(255)
    firstName: string;

    @IsString()
    @MaxLength(255)
    lastName: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    ssnvs?: string;

    @IsDateOnlyString()
    @IsOptional()
    birthDate?: string;
    
    @IsString()
    @IsISO31661Alpha2()
    @IsOptional()
    country?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    fatherFirstName?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    fatherLastName?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    motherFirstName?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    motherLastName?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    mobilePhone?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    emergencyContact?: string;
}

export class UpdatePersonalBindings {
    @IsString()
    @MaxLength(255)
    @IsOptional()
    firstName?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    lastName?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    ssnvs?: string;

    @IsDateOnlyString()
    @IsOptional()
    birthDate?: string;
    
    @IsString()
    @IsISO31661Alpha2()
    @IsOptional()
    country?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    fatherFirstName?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    fatherLastName?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    motherFirstName?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    motherLastName?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    mobilePhone?: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    emergencyContact?: string;
}

