import { Controller, Post, Body, Get, Param, Put, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../app/users/users.service';
import { LoginBindingModel, RegisterBindingModel, ForgotPassworBindingdModel, ResetPasswordBindingModel } from './models/auth.bindings';
import { Role } from './models/claims.interface';
import { LoginViewModel } from './models/auth.viewmodel';
import { PersonalService } from '../app/users/personal/personal.service';
import { Token } from './models/token.interface';
import { Connection } from 'typeorm';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private personalService: PersonalService,
        @InjectQueue('emails') private emailQueue: Queue<ISendMailOptions>,
        private configService: ConfigService,
        private connection: Connection
    ) { }

    @Post('login')
    async login(@Body() credentials: LoginBindingModel): Promise<LoginViewModel> {
        return {
            accessToken: await this.authService.verifyCredentialsAndGenerateJWT(credentials.email, credentials.password)
        };
    }

    @Post('register')
    async register(@Body() userData: RegisterBindingModel): Promise<void> {
        const verifyToken = await this.connection.transaction(async () => {
            const user = await this.usersService.create(userData.email, userData.password);
            const verifyToken = await this.authService.getVerificationToken(user.id);
            await this.authService.setUserRole(user, Role.User);
            await this.personalService.create({ firstName: userData.firstName, lastName: userData.lastName }, user.id);
            return verifyToken;
        });
        await this.emailQueue.add({
            to: userData.email,
            template: 'verify',
            context: {
                buttonUrl: `${this.configService.get<string>('apiUrl')}/auth/verify/${verifyToken}`,
                title: 'Email verification'
            },
            subject: 'Welcome to IHB. Verify your email!'
        });
    }

    @Get('verify/:token')
    @Redirect()
    async verify(@Param('token') token: string) {
        try {
            await this.authService.verify(token);
            return { url: this.configService.get<string>('frontendUrl')! + '/auth/login?verify=true' };
        } catch(e) {
            return { url: this.configService.get<string>('frontendUrl')! + '/auth/login?verify=false' };
        }
    }

    @Post('forgot-password')
    async forgotPassword(
        @Body() userEmail: ForgotPassworBindingdModel
    ): Promise<void> {
        const email = userEmail.email;
        await new Promise(resolve => setTimeout(resolve, 3000)); // TODO
        const token = await this.authService.generateForgotPasswordToken(email);
        await this.emailQueue.add({
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
        await this.authService.checkTokenValidity(token, Token.FORGOT_PASSWORD);
    }

    @Put('reset-password/:token')
    async changePassword(
        @Param('token') token: string,
        @Body() resetPassword: ResetPasswordBindingModel
    ): Promise<void> {
        await this.authService.changePasswordWithToken(token, resetPassword.newPassword);
    }
}
