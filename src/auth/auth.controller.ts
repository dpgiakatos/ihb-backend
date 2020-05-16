import { Controller, Post, Body, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from './decorators/user.decorator';
import { LoginBindingModel, RegisterBindingModel } from './models/auth.bindings';
import { Claims, Role } from './models/claims.interface';
import { LoginViewModel } from './models/auth.viewmodel';
import { Auth } from './decorators/auth.decorator';
import { PersonalService } from '../personal/personal.service';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private personalService: PersonalService,
        private mailerService: MailerService,
        private configService: ConfigService
    ) { }

    @Post('login')
    async login(@Body() credentials: LoginBindingModel): Promise<LoginViewModel> {
        return {
            accessToken: await this.authService.verifyCredentialsAndGenerateJWT(credentials.email, credentials.password)
        };
    }

    @Post('register')
    async register(@Body() userData: RegisterBindingModel): Promise<void> {
        const user = await this.usersService.create(userData.email, userData.password);
        await this.authService.setUserRole(user, Role.User);
        await this.personalService.create({ firstName: userData.firstName, lastName: userData.lastName }, user.id);
        await this.mailerService.sendMail({
            to: userData.email,
            template: 'verify',
            context: {
                buttonUrl: `${this.configService.get<string>('apiUrl')}/auth/verify/jhgfhjsdgfajhgfdjhasgf`,
                title: 'Email verification'
            },
            subject: 'Welcome to IHB. Verify your email!'
        });
    }

    @Get('profile')
    @Auth
    // @Roles(Role.Administrator)
    getProfile(@User() claims: Claims) {
        return claims;
    }
}
