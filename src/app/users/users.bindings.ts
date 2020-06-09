import { IsString } from 'class-validator';


export class ChangePasswordBindings {
    @IsString()
    oldPassword: string;

    @IsString()
    password: string;

    @IsString()
    newPassword: string;
}
