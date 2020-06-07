import { Controller, Delete, Get, NotFoundException, Param, Query } from '@nestjs/common';
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
            const [users, count] = await this.usersTabService.getUsersWithRoleDoctorAndAdministrator(page);
            return { users, count };
        } else if (doctor) {
            const [users, count] = await this.usersTabService.getAllDoctors(page);
            return { users, count };
        } else if (administrator) {
            const [users, count] = await this.usersTabService.getAllAdministrators(page);
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
            const [users, count] = await this.usersTabService.searchUsersWithRoleDoctorAndAdministrator(search, page);
            return { users, count };
        } else if (doctor) {
            const [users, count] = await this.usersTabService.searchAllDoctors(search, page);
            return { users, count };
        } else if (administrator) {
            const [users, count] = await this.usersTabService.searchAllAdministrators(search, page);
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
        const info = await this.usersTabService.getUser(id);
        const role = await this.usersTabService.getUserRole(id);
        return { info, role };
    }

    @Get(':userId/set-role')
    @Roles(Role.Administrator)
    async setUserRole(
        @Param('userId') id: string,
        @Query('role') role: string
    ) {
       const user = await this.userService.findOneById(id);
       if (!user) {
           throw new NotFoundException();
       }
       if (role === 'Doctor') {
           await this.usersTabService.setUserRole(user, Role.Doctor);
       } else if (role === 'Administrator') {
           await this.usersTabService.setUserRole(user, Role.Administrator);
       }
    }

    @Delete(':userId/delete-role')
    @Roles(Role.Administrator)
    async deleteUserRole(
        @Param('userId') id: string,
        @Query('role') role: string
    ) {
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new NotFoundException();
        }
        if (role === 'Doctor') {
            await this.usersTabService.deleteUserRole(user, Role.Doctor);
        } else if (role === 'Administrator') {
            await this.usersTabService.deleteUserRole(user, Role.Administrator);
        }
    }

    @Delete(':userId/delete')
    @Roles(Role.Administrator)
    async deleteUser(@Param('userId') id: string) {
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new NotFoundException();
        }
        await this.userService.delete(user);
    }
}
