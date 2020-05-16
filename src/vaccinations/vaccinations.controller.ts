import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Role } from '../auth/models/claims.interface';
import { AddExtraVaccinationsBindingModel } from './models/vaccinations.bindings';
import { Auth } from '../auth/decorators/auth.decorator';
import { VaccinationsService } from './vaccinations.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Auth
@Controller('dashboard')
export class VaccinationsController {

    constructor(
        private vaccinationsService: VaccinationsService
    ) {}

    @Get('vaccinations')
    async findAllVaccines() {
        return await this.vaccinationsService.findAllVaccines();
    }

    @Get('user_vaccines/:userId')
    async getUserVaccinesId(@Param('userId') id: string) {
        return await this.vaccinationsService.getUserVaccines(id);
    }

    @Post('edit_vaccinations/:userId')
    @Roles(Role.Doctor)
    async editVaccinations(
        @Param('userId') id: string,
        @Body() vaccines: { [key: string]: boolean }
    ) {
        await this.vaccinationsService.editVaccinations(vaccines, id);
    }

    @Get('extra_vaccinations')
    async findExtraVaccinations(
        @Query('userId') id: string,
        @Query('vaccinePageId') page: number
    ) {
        return await this.vaccinationsService.findExtraVaccinations(page, id);
    }

    @Get('count_extra_vaccinations/:userId')
    async countExtraVaccinations(@Param('userId') id: string) {
        return await this.vaccinationsService.countExtraVaccinations(id);
    }

    @Post('add_extra_vaccinations/:userId')
    @Roles(Role.Doctor)
    async addExtraVaccinations(@Param('userId') id: string, @Body() vaccine: AddExtraVaccinationsBindingModel) {
        return await this.vaccinationsService.addExtraVaccinations(vaccine, id);
    }

    @Put('edit_extra_vaccinations')
    @Roles(Role.Doctor)
    async editExtraVaccinations(
        @Query('vaccineId') vaccineId: number,
        @Query('userId') userId: string,
        @Body() vaccine: AddExtraVaccinationsBindingModel,
    ) {
        return await this.vaccinationsService.editExtraVaccinations(vaccineId, vaccine, userId);
    }

    @Delete('delete_extra_vaccinations')
    @Roles(Role.Doctor)
    async deleteExtraVaccinations(
        @Query('vaccineId') vaccineId: number,
        @Query('userId') userId: string
    ) {
        await this.vaccinationsService.deleteExtraVaccinations(vaccineId, userId);
    }
}
