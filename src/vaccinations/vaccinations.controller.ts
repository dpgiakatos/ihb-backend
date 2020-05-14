import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Claims } from '../auth/models/claims.interface';
import { User as UserDec } from '../auth/decorators/user.decorator'
import { AddExtraVaccinationsBindingModel } from './models/vaccinations.bindings';
import { Auth } from '../auth/decorators/auth.decorator';
import { VaccinationsService } from './vaccinations.service';

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
    async getUserVaccines(@UserDec() claims: Claims) {
        return await this.vaccinationsService.getUserVaccines(claims);
    }

    @Post('edit_vaccinations')
    async editVaccinations(@Body() vaccines: { [key: string]: boolean }, @UserDec() claims: Claims) {
        await this.vaccinationsService.editVaccinations(vaccines, claims);
    }

    @Get('extra_vaccinations/:page')
    async findExtraVaccinations(
        @Param('page', ParseIntPipe) page: number,
        @UserDec() claims: Claims
    ) {
        return await this.vaccinationsService.findExtraVaccinations(page, claims);
    }

    @Get('count_extra_vaccinations')
    async countExtraVaccinations(@UserDec() claims: Claims) {
        return await this.vaccinationsService.countExtraVaccinations(claims);
    }

    @Post('add_extra_vaccinations')
    async addExtraVaccinations(@Body() vaccine: AddExtraVaccinationsBindingModel, @UserDec() claims: Claims) {
        return await this.vaccinationsService.addExtraVaccinations(vaccine, claims);
    }

    @Put('edit_extra_vaccinations/:id')
    async editExtraVaccinations(
        @Param('id', ParseIntPipe) id: number,
        @Body() vaccine: AddExtraVaccinationsBindingModel,
        @UserDec() claims: Claims
    ) {
        return await this.vaccinationsService.editExtraVaccinations(id, vaccine, claims);
    }

    @Delete('delete_extra_vaccinations/:id')
    async deleteExtraVaccinations(@Param('id', ParseIntPipe) id: number, @UserDec() claims: Claims) {
        await this.vaccinationsService.deleteExtraVaccinations(id, claims);
    }
}
