import { Controller, Delete, Get, NotFoundException, Param, Query, Put, UnprocessableEntityException } from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/claims.interface';
import { UsersService } from '../users/users.service';
import { PersonalService } from '../users/personal/personal.service';
import { AuthService } from '../../auth/auth.service';
import { Personal } from '../users/personal/personal.entity';

@Auth
@Roles(Role.Administrator)
@Controller('administrator')
export class AdministratorController {
    constructor(
        private userService: UsersService,
        private personalService: PersonalService,
        private authService: AuthService
    ) { }

    @Get('users')
    async getFilteredUsers(
        @Query('search') search: string | undefined,
        @Query('page') page = 1,
        @Query('doctor') doctor?: boolean,
        @Query('administrator') administrator?: boolean
    ): Promise<{users: Personal[], count: number}> {
        let roles: Role | Role[] | undefined;
        if (doctor && administrator) {
            roles = [Role.Doctor, Role.Administrator];
        } else if (administrator) {
            roles = Role.Administrator;
        } else if (doctor) {
            roles = Role.Doctor;
        } else {
            roles = undefined;
        }

        const [users, count] = await this.personalService.findByFiltering(page, { search, role: roles });

        return { users, count };
    }
    
    @Get(':userId/tab')
    async getUser(@Param('userId') id: string) {
        await this.userService.assertExists(id);
        const info = await this.personalService.getSelectedUser(id);
        const role = await this.authService.getUserRole(id);
        return { info, role };
    }

    @Put(':userId/set-role')
    async setUserRole(
        @Param('userId') id: string,
        @Query('role') role: Role
    ): Promise<void> {
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new NotFoundException();
        }
        if (role !== Role.Administrator && role !== Role.Doctor) {
            throw new UnprocessableEntityException('Only Administrator and Doctor role allowed to be edited');
        }
        await this.authService.setUserRole(user, role);
    }

    @Delete(':userId/delete-role')
    async deleteUserRole(
        @Param('userId') id: string,
        @Query('role') role: string
    ) {
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new NotFoundException();
        }
        if (role === 'Doctor') {
            await this.authService.deleteUserRole(user, Role.Doctor);
        } else if (role === 'Administrator') {
            await this.authService.deleteUserRole(user, Role.Administrator);
        }
    }

    @Delete(':userId/delete')
    async deleteUser(@Param('userId') id: string) {
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new NotFoundException();
        }
        await this.userService.delete(user);
    }
}
