import { IsString } from 'class-validator';

export class AlertLog {
    @IsString()
    accessTime: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}
