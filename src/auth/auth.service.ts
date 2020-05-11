import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare }  from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
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
        @InjectRepository(Role) private roleRepository: Repository<Role>
    ) { }

    async verifyCredentialsAndGenerateJWT(email: string, password: string): Promise<string> {
        const user = await this.usersService.findOne(email);
        await this.verifyCredentials(user, password);
        return this.generateJWT({
            id: user.id,
            roles: user.roles.map(role => role.role)
        });
    }

    async setUserRole(user: User, role: RoleEnum): Promise<void> {
        const userRole = this.roleRepository.create({
            user,
            role
        });

        await this.roleRepository.save(userRole);
    }

    private async verifyCredentials(user: User, password: string) {
        if (!user || !(await compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    private generateJWT(claims: Claims) {
        return this.jwtService.signAsync(claims);
    }
}
