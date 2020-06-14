import { IsString, MaxLength } from 'class-validator';

export class ContactBindings {
    @IsString()
    @MaxLength(255)
    email: string;

    @IsString()
    @MaxLength(255)
    subject: string;

    @IsString()
    @MaxLength(5000)
    message: string;
}
