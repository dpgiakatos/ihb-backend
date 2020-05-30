import { IsString, IsOptional } from "class-validator";

export class CreateContactBindings {
    @IsString()
    email: string;

    @IsString()
    subject: string;

    @IsString()
    message: string;
}
