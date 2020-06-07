import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from './decorators/user.decorator';
import { LoginBindingModel, RegisterBindingModel, ForgotPassworBindingdModel, ResetPasswordBindingModel } from './models/auth.bindings';
import { Claims, Role } from './models/claims.interface';
import { LoginViewModel } from './models/auth.viewmodel';
import { Auth } from './decorators/auth.decorator';
import { PersonalService } from '../users/personal/personal.service';
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

    @Post('forgot-password')
    async forgotPassword(
        @Body() userEmail: ForgotPassworBindingdModel
    ): Promise<void> {
        const email = userEmail.email;        
        const token = await this.authService.generateForgotPasswordToken(email);
        await this.mailerService.sendMail({
            to: email,
            template: 'reset-password',
            context: {
                buttonUrl: `${this.configService.get<string>('frontendUrl')}/auth/reset-password/${token}`,
            },
            subject: 'Reset your password'
        });

    }

    @Get('reset-password/:token')
    async checkToken(
        @Param('token') token: string
    ): Promise<void> {
        await this.authService.checkTokenValidity(token);
    }

    @Put('reset-password/:token')
    async changePassword(
        @Param('token') token: string,
        @Body() resetPassword: ResetPasswordBindingModel
    ): Promise<void> {
        await this.authService.changePasswordWithToken(token, resetPassword.newPassword);
    }

    @Get('profile')
    @Auth
    // @Roles(Role.Administrator)
    getProfile(@User() claims: Claims) {
        return claims;
    }
}
