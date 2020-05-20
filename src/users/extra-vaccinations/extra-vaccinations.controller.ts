import { Controller, Put, Body, Delete, Post, Param, Get, Query } from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role, Claims } from '../../auth/models/claims.interface';
import { User } from '../../auth/decorators/user.decorator';
import { AddExtraVaccinationBindingModel, UpdateExtraVaccinationBindingModel } from './extra-vaccinations.bindings';
import { ExtraVaccinationsService } from './extra-vaccinations.service';
import { UsersService } from '../users.service';
import { ExtraVaccination } from './extra-vaccination.entity';

@Auth
@Controller('user')
export class ExtraVaccinationsController {
    
    constructor(private extraVaccinationsService: ExtraVaccinationsService, private userService: UsersService) { }

    @Get('extra-vaccinations')
    async getUserExtraVaccines(
        @User() user: Claims,
        @Query('page') page = 1
    ): Promise<{ vaccinations: ExtraVaccination[]; count: number; }> {
        const [vaccinations, count] = await this.extraVaccinationsService.findExtraVaccinations(user.id, page);
        return { vaccinations, count };
    }

    @Get(':userId/extra-vaccinations')
    @Roles(Role.Doctor)
    async getSpecificUserExtraVaccines(
        @Param('userId') id: string,
        @Query('page') page = 1
    ): Promise<{ vaccinations: ExtraVaccination[]; count: number; }> {
        await this.userService.assertExists(id);
        const [vaccinations, count] = await this.extraVaccinationsService.findExtraVaccinations(id, page);
        return { vaccinations, count };
    }


    @Post(':userId/extra-vaccinations')
    @Roles(Role.Doctor)
    async addExtraVaccinations(
        @Param('userId') id: string,
        @Body() vaccination: AddExtraVaccinationBindingModel
    ): Promise<ExtraVaccination> {
        await this.userService.assertExists(id);
        return await this.extraVaccinationsService.addExtraVaccination(vaccination, id);
    }

    @Put('extra-vaccination/:extraVaccinationId')
    @Roles(Role.Doctor)
    async editExtraVaccination(
        @Param('extraVaccinationId') vaccinationId: string,
        @Body() vaccination: UpdateExtraVaccinationBindingModel,
    ): Promise<ExtraVaccination> {
        return await this.extraVaccinationsService.editExtraVaccination(vaccinationId, vaccination);
    }

    @Delete('extra-vaccination/:extraVaccinationId')
    @Roles(Role.Doctor)
    async deleteExtraVaccination(@Param('extraVaccinationId') vaccinationId: string): Promise<void> {
        await this.extraVaccinationsService.deleteExtraVaccination(vaccinationId);
    }
}