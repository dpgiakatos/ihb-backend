import { Injectable } from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {compare} from "bcrypt";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await compare(password, user.password)) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }
}
