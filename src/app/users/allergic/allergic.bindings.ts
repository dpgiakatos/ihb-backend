import { IsString } from 'class-validator';

export class AllergicBindings {
    @IsString()
    name: string;

    @IsString()
    diseaseDescription: string;

    @IsString()
    treatmentDescription: string;
}
