import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Role, Claims } from '../../auth/models/claims.interface';
import { Auth } from '../../auth/decorators/auth.decorator';
import { VaccinationsService } from './vaccinations.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { User } from '../../auth/decorators/user.decorator';
import { DoctorService } from '../../doctor/doctor.service';

@Auth
@Controller('user')
export class VaccinationsController {

    constructor(
        private vaccinationsService: VaccinationsService,
        private doctorService: DoctorService
    ) {}

    @Get('vaccinations')
    vaccines(@User() user: Claims) {
        return this.vaccinationsService.getUserVaccinations(user.id);
    }

    // ektos
    @Get('vaccines')
    async findAllVaccines() {
        return await this.vaccinationsService.findAllVaccines();
    }

    @Get(':userId/vaccinations')
    @Roles(Role.Doctor)
    async getUserVaccinesId(@Param('userId') userId: string, @User() claims: Claims) {
        if (await this.doctorService.hasAccess(userId, claims)) {
            return await this.vaccinationsService.getUserVaccinations(userId);
        }
    }

    @Put(':userId/vaccinations')
    @Roles(Role.Doctor)
    async editVaccinations(
        @Param('userId') userId: string,
        @Body() vaccines: { [key: string]: boolean },
        @User() claims: Claims
    ) {
        if (await this.doctorService.hasAccess(userId, claims)) {
            await this.vaccinationsService.editVaccinations(vaccines, userId);
        }
    }

}
