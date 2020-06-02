import { IsString } from 'class-validator';


export class PasswordBindings {
    @IsString()
    oldPassword: string;

    @IsString()
    password: string;

    @IsString()
    newPassword: string;
}