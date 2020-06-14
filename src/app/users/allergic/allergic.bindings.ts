import { IsString, MaxLength } from 'class-validator';

export class AllergicBindings {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsString()
    @MaxLength(255)
    diseaseDescription: string;

    @IsString()
    @MaxLength(255)
    treatmentDescription: string;
}
