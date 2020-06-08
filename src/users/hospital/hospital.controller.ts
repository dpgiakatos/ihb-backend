import { Body, Controller, Delete, Get, Param, Post, Put, Query, ForbiddenException } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { User } from '../../auth/decorators/user.decorator';
import { HospitalBindings } from './hospital.bindings';
import { Claims, Role } from '../../auth/models/claims.interface';
import { Auth } from '../../auth/decorators/auth.decorator';
import { UsersService } from '../users.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { DoctorService } from '../../doctor/doctor.service';
import { HospitalTreatment } from './hospital.entity';

@Auth
@Controller('user')
export class HospitalController {

    constructor(
        private hospitalService: HospitalService,
        private userService: UsersService,
        private doctorService: DoctorService
    ){}

    @Get('hospital-treatments')
    async getUserTreatments(
        @User() user: Claims,
        @Query('page') page = 1
    ): Promise<{ treatments: HospitalTreatment[]; count: number; }> {
        const [treatments, count] = await this.hospitalService.findHospitalTreatments(user.id, page);
        return { treatments, count };
    }

    @Get(':userId/hospital-treatments')
    @Roles(Role.Doctor)
    async getSomeTreatments(
        @Param('userId') id: string, 
        @Query('page') page: 1,
        @User() claims: Claims
    ): Promise<{ treatments: HospitalTreatment[]; count: number }> {
        if (! (await this.doctorService.hasAccess(id, claims))) {
            throw new ForbiddenException();
        }
        await this.userService.assertExists(id);
        const [treatments, count] = await this.hospitalService.findHospitalTreatments(id, page);
        return { treatments, count };
    }

    @Post(':userId/hospital-treatments')
    @Roles(Role.Doctor)
    async addHospitalTreatments( 
        @Param('userId') id: string,
        @Body() hospital: HospitalBindings,
        @User() claims: Claims
    ): Promise<HospitalTreatment>{
        if (!(await this.doctorService.hasAccess(id, claims))) {
            throw new ForbiddenException();
        }
        await this.userService.assertExists(id);
        return await this.hospitalService.addHospitalTreatment(hospital, id);
    }

    @Put('hospital-treatment/:hospitalTreatmentId')
    @Roles(Role.Doctor)
    async editHospitalTreatments(
        @Param('hospitalTreatmentId') treatmentId: string,
        @Body() hospital: HospitalBindings,
        @User() claims: Claims
    ): Promise<HospitalTreatment> {
        const userId = await this.hospitalService.getUserId(treatmentId);
        if (!(await this.doctorService.hasAccess(userId, claims))) {
            throw new ForbiddenException();
        }
        return await this.hospitalService.editHospitalTreatments(treatmentId, hospital);
    }

    @Delete('hospital-treatment/:hospitalTreatmentId')
    @Roles(Role.Doctor)
    async deleteHospitalTreatments(
        @Param('hospitalTreatmentId') treatmentId: string,
        @User() claims: Claims
    ): Promise<void> {
        const userId = await this.hospitalService.getUserId(treatmentId);
        if (!(await this.doctorService.hasAccess(userId, claims))) {
            throw new ForbiddenException();
        }
        await this.hospitalService.deleteHospitalTreatments(treatmentId);
    }
 }
