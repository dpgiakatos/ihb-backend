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

export class ForgotPasswordModel {
    @IsEmail()
    email: string;
}

export class UserIdModel {
    // @IsUUID()
    userId: string;
}

export class TokenModel {
    // @IsString()
    // @Length(10)
    token: string;
}