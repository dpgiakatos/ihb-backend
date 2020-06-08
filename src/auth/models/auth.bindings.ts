import { IsEmail, IsString } from 'class-validator';

export class LoginBindingModel {
    @IsString()
    email: string;

    @IsString()
    password: string;
}

export class RegisterBindingModel {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}

export class ForgotPassworBindingdModel {
    @IsEmail()
    email: string;
}

export class ResetPasswordBindingModel {
    @IsString()
    newPassword: string;
}