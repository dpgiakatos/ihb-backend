import { Role } from "../../auth/models/claims.interface";
import { IsString } from "class-validator";

export class AddRoleBindingsModel {
    @IsString()
    role: Role
}