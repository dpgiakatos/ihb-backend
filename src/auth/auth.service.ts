import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../app/users/users.service';
import { compare }  from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../app/users/user.entity';
import { Claims } from './models/claims.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './models/role.entity';
import { Role as RoleEnum } from './models/claims.interface';
import { Token } from './models/token.entity';
import { Token as TokenEnum } from './models/token.interface';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(Role) private rolesRepository: Repository<Role>,
        @InjectRepository(Token) private tokenRepository: Repository<Token>
    ) { }

    async verifyCredentialsAndGenerateJWT(user: User, password: string): Promise<string> {
        await this.verifyCredentials(user, password);
        return this.generateJWT({
            id: user!.id,
            roles: user!.roles.map(role => role.role)
        });
    }

    async setUserRole(user: User, role: RoleEnum): Promise<void> {
        const userRole = this.rolesRepository.create({
            user,
            role
        });
        if (!(await this.rolesRepository.findOne(userRole))) {
            await this.rolesRepository.save(userRole);
        }
    }

    async getUserRole(userId: string): Promise<RoleEnum[]> {
        const roles = await this.rolesRepository.find({
            select: ['role'],
            where: [{ user: userId }]
        });
        return roles.map(role => role.role);
    }

    async deleteUserRole(user: User, role: RoleEnum) {
        return await this.rolesRepository.delete({
            user,
            role
        });
    }

    async getVerificationToken(userId: string): Promise<string> {
        const existingToken = await this.tokenRepository.findOne({ userId, tokenType: TokenEnum.VERIFY });
        if (existingToken) {
            if(!this.hasExpired(existingToken.timestamp, TokenEnum.VERIFY)) {
                return existingToken.token;
            }
            await this.tokenRepository.remove(existingToken);
        }
        const token = this.generateToken();
        const tokenEntity = this.tokenRepository.create({
            tokenType: TokenEnum.VERIFY,
            token: token,
            userId: userId
        });
        await this.tokenRepository.save(tokenEntity);

        return token;
    }

    async verify(token: string) {
        const existingToken = await this.checkTokenValidity(token, TokenEnum.VERIFY);
        const user = await this.usersService.findOneById(existingToken.userId);
        await this.usersService.verify(user!);
    }

    async generateForgotPasswordToken(userEmail: string): Promise<string> {
        const user = await this.usersService.findOneByEmail(userEmail);        
        if(!user) {
            throw new NotFoundException();
        }
        const userId = user.id;
        const existingToken = await this.tokenRepository.findOne({ userId, tokenType: TokenEnum.FORGOT_PASSWORD });
        if (existingToken) {
            if(!this.hasExpired(existingToken.timestamp, TokenEnum.FORGOT_PASSWORD)) {
                return existingToken.token;
            }
            await this.tokenRepository.remove(existingToken);
        }
        const token = this.generateToken();
        const tokenEntity = this.tokenRepository.create({
            tokenType: TokenEnum.FORGOT_PASSWORD,
            token: token,
            userId: userId
        });
        await this.tokenRepository.save(tokenEntity);

        return token;
    }

    async changePasswordWithToken(token: string, newPassword: string) {
        const existingToken = await this.checkTokenValidity(token, TokenEnum.FORGOT_PASSWORD);
        const existing = await this.usersService.findOneById(existingToken.userId);
        await this.usersService.changePassword(existing!, newPassword);
    }

    async checkTokenValidity(token: string, tokenType: TokenEnum): Promise<Token> {
        const existingToken = await this.tokenRepository.findOne({ token, tokenType });
        if (!existingToken) {
            throw new NotFoundException();
        }
        else if (this.hasExpired(existingToken.timestamp, tokenType)) {
            throw new NotFoundException();
        }
        return existingToken;
    }

    private async verifyCredentials(user: User | undefined, password: string) {
        if (user && await compare(password, user.password)) {
            return;
        }
        throw new UnauthorizedException();
    }

    private generateJWT(claims: Claims) {
        return this.jwtService.signAsync(claims);
    }

    private hasExpired(createdAt: Date, tokenType: TokenEnum): boolean {
        const current = new Date();
        let validTime: number;
        switch(tokenType) {
            case TokenEnum.FORGOT_PASSWORD:
                validTime = 60 * 60 * 1000; // 1 hour in milliseconds
                break;
            case TokenEnum.VERIFY:
                validTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
                break;
        }
        if (current.getTime() - createdAt.getTime() < validTime) {
            return false;
        }
        else {
            return true;
        }
    }

    private generateToken(): string {
        return randomBytes(72).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    }

}
