import { IsString, IsOptional } from 'class-validator';
import { IsDateOnlyString } from '../../../helpers/date.decorator';


export class CreatePersonalBindings {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    @IsOptional()
    ssnvs?: string;

    @IsDateOnlyString()
    @IsOptional()
    birthDate?: string;
    
    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    fatherFirstName?: string;

    @IsString()
    @IsOptional()
    fatherLastName?: string;

    @IsString()
    @IsOptional()
    motherFirstName?: string;

    @IsString()
    @IsOptional()
    motherLastName?: string;

    @IsString()
    @IsOptional()
    mobilePhone?: string;

    @IsString()
    @IsOptional()
    emergencyContact?: string;
}

export class UpdatePersonalBindings {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    ssnvs?: string;

    @IsDateOnlyString()
    @IsOptional()
    birthDate?: string;
    
    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    fatherFirstName?: string;

    @IsString()
    @IsOptional()
    fatherLastName?: string;

    @IsString()
    @IsOptional()
    motherFirstName?: string;

    @IsString()
    @IsOptional()
    motherLastName?: string;

    @IsString()
    @IsOptional()
    mobilePhone?: string;

    @IsString()
    @IsOptional()
    emergencyContact?: string;
}

