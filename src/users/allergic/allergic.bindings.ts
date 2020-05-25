import { IsString } from 'class-validator';


export class AllergicBindings {
    @IsString()
    name: string;

    @IsString()
    dDescription: string;

    @IsString()
    tDescription: string;

}