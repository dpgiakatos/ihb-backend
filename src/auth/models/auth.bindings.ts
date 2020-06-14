import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginBindingModel {
    @IsString()
    email: string;

    @IsString()
    password: string;
}

export class RegisterBindingModel {
    @IsEmail()
    @MaxLength(255)
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @MaxLength(255)
    firstName: string;

    @IsString()
    @MaxLength(255)
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