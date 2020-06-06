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

        await this.rolesRepository.save(userRole);
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

    async generateForgotPasswordToken(userEmail: string): Promise<void> {
        const type = TokenEnum.forgotPassword;
        const existing = await this.usersService.findOneByEmail(userEmail);        
        if(!existing) {
            throw new NotFoundException();
        }
        const userId = existing.id;
        const existingToken = await this.tokenRepository.findOne({ userId });
        if (!existingToken)
        {
            const token = this.generateToken();
            const temp = this.tokenRepository.create({
                tokenType: type,
                isActive: true,
                token: token,
                userId: userId
            });
            console.log(token);

            await this.tokenRepository.save(temp);
        }
        else if (this.hasExpired(existingToken.timestamp) && existingToken.tokenType == type)
        {
            await this.tokenRepository.remove(existingToken);
            const token = this.generateToken();
            const temp = this.tokenRepository.create({
                tokenType: type,
                isActive: true,
                token: token,
                userId: userId
            });
            console.log(token);

            await this.tokenRepository.save(temp);
        }
        else {  
            console.log('exist a valid token');
                     
            throw new ForbiddenException();
        }
        
    }

    generateToken(): string {
        return randomBytes(90).toString('hex').toString();
    }

    hasExpired(date: Date): boolean
    {
        const temp = new Date();
        const hour = 1000 * 60 * 60; // 1 hour in milliseconds
        if (temp.getTime() - date.getTime() < hour){
            return false;
        }
        else {
            return true;
        }
    }

    async checkValidityOfToken(userId: string, token: string)
    {
        const existing = await this.tokenRepository.findOne({ userId, token });
        if (!existing){
            throw new NotFoundException();
        }
        else if(this.hasExpired(existing.timestamp)) {
            throw new ForbiddenException();
        }
    }

    async resetPassword(userId: string, newPassword: string)
    {
        const existing = await this.usersService.findOneById(userId);
        if (!existing){
            throw new NotFoundException();
        }
        const oldPassword = existing.password;
        await this.usersService.editPassword(userId, oldPassword, newPassword);
    }


}
