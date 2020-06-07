import { Injectable, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare }  from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { Claims } from './models/claims.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './models/role.entity';
import { Role as RoleEnum } from './models/claims.interface';
import { Token } from './models/tokens.entity';
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

    async verifyCredentialsAndGenerateJWT(email: string, password: string): Promise<string> {
        const user = await this.usersService.findOneByEmail(email);
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

    async getUserRole(userId: string): Promise<Role[]> {
        return await this.rolesRepository.find({
            select: ['role'],
            where: [{ user: userId }]
        });
    }

    async deleteUserRole(user: User, role: RoleEnum) {
        return await this.rolesRepository.delete({
            user,
            role
        });
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

    async generateForgotPasswordToken(userEmail: string): Promise<string> {
        const type = TokenEnum.forgotPassword;
        const existing = await this.usersService.findOneByEmail(userEmail);        
        if(!existing) {
            throw new NotFoundException();
        }
        const userId = existing.id;
        const existingToken = await this.tokenRepository.findOne({ userId, tokenType: type });
        if (!existingToken)
        {
            const token = this.generateToken();
            const temp = this.tokenRepository.create({
                tokenType: type,
                isActive: true,
                token: token,
                userId: userId
            });
            await this.tokenRepository.save(temp);

            return token;

        }
        else if (this.hasExpired(existingToken.timestamp))
        {
            await this.tokenRepository.remove(existingToken);
            const token = this.generateToken();
            const temp = this.tokenRepository.create({
                tokenType: type,
                isActive: true,
                token: token,
                userId: userId
            });
            await this.tokenRepository.save(temp);

            return token;
        }
        else {               
            return existingToken.token;
        }
        
    }

    async changePasswordWithToken(token: string, newPassword: string)
    {
        const existingToken = await this.checkTokenValidity(token);
        const existing = await this.usersService.findOneById(existingToken.userId);
        await this.usersService.changePassword(existing!, newPassword);
    }


    generateToken(): string {
        return randomBytes(90).toString('hex').toString();
    }

    hasExpired(date: Date): boolean {
        const temp = new Date();
        const hour = 1000 * 60 * 60; // 1 hour in milliseconds
        if (temp.getTime() - date.getTime() < hour) {
            return false;
        }
        else {
            return true;
        }
    }

    async checkTokenValidity(token: string): Promise<Token> {
        const existingToken = await this.tokenRepository.findOne({ token, tokenType: TokenEnum.forgotPassword });
        if (!existingToken) {
            throw new NotFoundException();
        }
        else if (this.hasExpired(existingToken.timestamp)) {
            throw new ForbiddenException();
        }
        return existingToken;
    }

}
