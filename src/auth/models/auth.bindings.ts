import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginBindingModel {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class RegisterBindingModel {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}