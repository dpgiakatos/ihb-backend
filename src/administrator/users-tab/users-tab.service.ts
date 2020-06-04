import { Injectable } from '@nestjs/common';
import { PersonalService } from '../../users/personal/personal.service';

@Injectable()
export class UsersTabService {
    constructor(private personalService: PersonalService) { }

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
}
