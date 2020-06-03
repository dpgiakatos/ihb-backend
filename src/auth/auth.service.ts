import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare }  from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { Claims } from './models/claims.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './models/role.entity';
import { Role as RoleEnum } from './models/claims.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(Role) private rolesRepository: Repository<Role>
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
}
