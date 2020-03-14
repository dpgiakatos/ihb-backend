import {Controller, Request, Post, UseGuards, Body} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {UsersService} from "../users/users.service";

@Controller('auth')
export class AuthController {
    constructor(private usersService: UsersService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return req.user;
    }

    @Post('register')
    async register(@Body() newUser) {
        await this.usersService.create(newUser);
    }
}
