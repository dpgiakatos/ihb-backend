import { IsEmail, IsString, IsUUID, Length } from 'class-validator';

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

export class UserIdBindingModel {
    @IsUUID()
    userId: string;
}

export class TokenBindingModel {
    @IsString()
    // @Length(10)
    token: string;
}

export class ResetPasswordBindingModel {
    @IsString()
    password: string;

    @IsString()
    newPassword: string;
}