import { Injectable } from '@nestjs/common';
import { PersonalService } from '../../users/personal/personal.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../users/user.entity';
import { Role } from '../../auth/models/claims.interface';

@Injectable()
export class UsersTabService {
    constructor(
        private personalService: PersonalService,
        private authService: AuthService
    ) { }

    async getAllUsers(page: number) {
        return await this.personalService.findAllUsers(page);
    }

    async getAllDoctors(page: number) {
        return await this.personalService.findAllDoctors(page);
    }

    async getAllAdministrators(page: number) {
        return await this.personalService.findAllAdministrators(page);
    }

    async getUsersWithRoleDoctorAndAdministrator(page: number) {
        return await this.personalService.findUsersWithRoleDoctorAndAdministrator(page);
    }

    async searchAllUsers(search: string, page: number) {
        return await this.personalService.searchAllUsers(search, page);
    }

    async searchAllDoctors(search: string, page: number) {
        return await this.personalService.searchAllDoctors(search, page);
    }

    async searchAllAdministrators(search: string, page: number) {
        return await this.personalService.searchAllAdministrators(search, page);
    }

    async searchUsersWithRoleDoctorAndAdministrator(search: string, page: number) {
        return await this.personalService.searchUsersWithRoleDoctorAndAdministrator(search, page);
    }

    async getUser(userId: string) {
        return await this.personalService.getSelectedUser(userId);
    }

    async getUserRole(userId: string) {
        return await this.authService.getUserRole(userId);
    }

    async setUserRole(user: User, role: Role) {
        return await this.authService.setUserRole(user, role);
    }

    async deleteUserRole(user: User, role: Role) {
        return await this.authService.deleteUserRole(user, role);
    }
}
