import { IsString, MinLength } from 'class-validator';

export class ChangePasswordBindings {
    @IsString()
    oldPassword: string;

    @IsString()
    @MinLength(8)
    password: string;
}
