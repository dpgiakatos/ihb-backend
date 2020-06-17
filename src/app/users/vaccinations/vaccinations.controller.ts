import { Body, Controller, Get, Param, Put, ForbiddenException } from '@nestjs/common';
import { Role, Claims } from '../../../auth/models/claims.interface';
import { Auth } from '../../../auth/decorators/auth.decorator';
import { VaccinationsService } from './vaccinations.service';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { User } from '../../../auth/decorators/user.decorator';
import { DoctorService } from '../../doctor/doctor.service';
import { Vaccine } from './vaccine.entity';

@Auth
@Controller('user')
export class VaccinationsController {

    constructor(
        private vaccinationsService: VaccinationsService,
        private doctorService: DoctorService
    ) { }

    @Get('vaccinations')
    vaccines(@User() user: Claims): Promise<Vaccine[]> {
        return this.vaccinationsService.getUserVaccinations(user.id);
    }

    // ektos
    @Get('vaccines')
    async findAllVaccines(): Promise<Vaccine[]> {
        return await this.vaccinationsService.findAllVaccines();
    }

    @Get(':userId/vaccinations')
    @Roles(Role.Doctor)
    async getUserVaccinesId(@Param('userId') userId: string, @User() claims: Claims): Promise<Vaccine[]> {
        if (!(await this.doctorService.hasAccess(userId, claims))) {
            throw new ForbiddenException();
        }
        return await this.vaccinationsService.getUserVaccinations(userId);
    }

    @Put(':userId/vaccinations')
    @Roles(Role.Doctor)
    async editVaccinations(
        @Param('userId') userId: string,
        @Body() vaccines: { [key: string]: boolean },
        @User() claims: Claims
    ): Promise<void> {
        if (!(await this.doctorService.hasAccess(userId, claims))) {
            throw new ForbiddenException();
        }
        await this.vaccinationsService.editVaccinations(vaccines, userId);
    }

}
