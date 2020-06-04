import { Controller, Get, Param, Query } from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/claims.interface';
import { UsersTabService } from './users-tab.service';
import { UsersService } from '../../users/users.service';

@Auth
@Controller('administrator')
export class UsersTabController {
    constructor(private usersTabService: UsersTabService, private userService: UsersService) { }

    @Get('users')
    @Roles(Role.Administrator)
    async getFilteredUsers(
        @Query('page') page = 1,
        @Query('doctor') doctor: boolean,
        @Query('administrator') administrator: boolean
    ) {
        if (doctor && administrator) {
            const users = await this.usersTabService.getUsersWithRoleDoctorAndAdministrator(page);
            const count = users.length;
            return { users, count };
        } else if (doctor) {
            const users = await this.usersTabService.getAllDoctors(page);
            const count = users.length;
            return { users, count };
        } else if (administrator) {
            const users = await this.usersTabService.getAllAdministrators(page);
            const count = users.length;
            return { users, count };
        } else {
            const [users, count] = await this.usersTabService.getAllUsers(page);
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
            const users = await this.usersTabService.searchUsersWithRoleDoctorAndAdministrator(search, page);
            const count = users.length;
            return { users, count };
        } else if (doctor) {
            const users = await this.usersTabService.searchAllDoctors(search, page);
            const count = users.length;
            return { users, count };
        } else if (administrator) {
            const users = await this.usersTabService.searchAllAdministrators(search, page);
            const count = users.length;
            return { users, count };
        } else {
            const [users, count] = await this.usersTabService.searchAllUsers(search, page);
            return { users, count };
        }
    }
    
    @Get(':userId/tab')
    @Roles(Role.Administrator)
    async getUser(@Param('userId') id: string) {
        await this.userService.assertExists(id);
        return await this.usersTabService.getUser(id);
    }
}
