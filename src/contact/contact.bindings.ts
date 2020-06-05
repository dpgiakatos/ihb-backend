import { IsString } from "class-validator";

export class ContactBindings {
    @IsString()
    email: string;

    @IsString()
    subject: string;

    @IsString()
    message: string;
}
