import { Controller, Get, Query } from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/claims.interface';
import { UsersTabService } from './users-tab.service';

@Auth
@Controller('administrator')
export class UsersTabController {
    constructor(private usersService: UsersTabService) { }

    @Get('users')
    @Roles(Role.Administrator)
    async getFilteredUsers(
        @Query('page') page = 1,
        @Query('doctor') doctor: boolean,
        @Query('administrator') administrator: boolean
    ) {
        if (doctor && administrator) {
            const users = await this.usersService.getUsersWithRoleDoctorAndAdministrator(page);
            const count = users.length;
            return { users, count };
        } else if (doctor) {
            const users = await this.usersService.getAllDoctors(page);
            const count = users.length;
            return { users, count };
        } else if (administrator) {
            const users = await this.usersService.getAllAdministrators(page);
            const count = users.length;
            return { users, count };
        } else {
            const [users, count] = await this.usersService.getAllUsers(page);
            return { users, count };
        }
    }

    @Get('search')
    @Roles(Role.Administrator)
    async searchFilteredUsers(
        @Query('search') search: string,
        @Query('page') page = 1,
        @Query('doctor') doctor: boolean,
        @Query('administrator') administrator: boolean
    ) {
        if (doctor && administrator) {
            const users = await this.usersService.searchUsersWithRoleDoctorAndAdministrator(search, page);
            const count = users.length;
            return { users, count };
        } else if (doctor) {
            const users = await this.usersService.searchAllDoctors(search, page);
            const count = users.length;
            return { users, count };
        } else if (administrator) {
            const users = await this.usersService.searchAllAdministrators(search, page);
            const count = users.length;
            return { users, count };
        } else {
            const [users, count] = await this.usersService.searchAllUsers(search, page);
            return { users, count };
        }
    }
}
