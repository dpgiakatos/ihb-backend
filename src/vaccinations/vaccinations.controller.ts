import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Claims, Role } from '../auth/models/claims.interface';
import { User } from '../auth/decorators/user.decorator'
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

    @Get('user_vaccines')
    async getUserVaccines(@User() claims: Claims) {
        return await this.vaccinationsService.getUserVaccines(claims.id);
    }

    @Get('user_vaccines/:id')
    @Roles(Role.Doctor)
    async getUserVaccinesId(@Param('id') id: string) {
        return await this.vaccinationsService.getUserVaccines(id);
    }

    @Post('edit_vaccinations')
    @Roles(Role.Doctor)
    async editVaccinations(@Body() vaccines: { [key: string]: boolean }, @User() claims: Claims) {
        await this.vaccinationsService.editVaccinations(vaccines, claims);
    }

    @Get('extra_vaccinations/:page')
    async findExtraVaccinations(
        @Param('page', ParseIntPipe) page: number,
        @User() claims: Claims
    ) {
        return await this.vaccinationsService.findExtraVaccinations(page, claims);
    }

    @Get('count_extra_vaccinations')
    async countExtraVaccinations(@User() claims: Claims) {
        return await this.vaccinationsService.countExtraVaccinations(claims);
    }

    @Post('add_extra_vaccinations')
    async addExtraVaccinations(@Body() vaccine: AddExtraVaccinationsBindingModel, @User() claims: Claims) {
        return await this.vaccinationsService.addExtraVaccinations(vaccine, claims);
    }

    @Put('edit_extra_vaccinations/:id')
    async editExtraVaccinations(
        @Param('id', ParseIntPipe) id: number,
        @Body() vaccine: AddExtraVaccinationsBindingModel,
        @User() claims: Claims
    ) {
        return await this.vaccinationsService.editExtraVaccinations(id, vaccine, claims);
    }

    @Delete('delete_extra_vaccinations/:id')
    async deleteExtraVaccinations(@Param('id', ParseIntPipe) id: number, @User() claims: Claims) {
        await this.vaccinationsService.deleteExtraVaccinations(id, claims);
    }
}
