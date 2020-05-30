import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { Hospital } from './hospital.entity';
import { User } from '../../auth/decorators/user.decorator';
import { HospitalBindings } from './hospital.bindings';
import { Claims, Role } from '../../auth/models/claims.interface';
import { Auth } from '../../auth/decorators/auth.decorator';
import { UsersService } from '../users.service';
import { Roles } from '../../auth/decorators/roles.decorator';

@Auth
@Controller('user')
export class HospitalController {

    constructor(
        private hospitalService: HospitalService,
        private userService: UsersService
    ){}

    @Get('hospital-treatments')
    async getUserTreatments(
        @User() user: Claims,
        @Query('page') page = 1
    ): Promise<{ hospitals: Hospital[]; count: number; }> {
        const [hospitals, count] = await this.hospitalService.findHospitalTreatments(user.id, page);
        return { hospitals, count };
    }

    @Get(':userId/hospital-treatments')
    @Roles(Role.Doctor)
    async getSomeTreatments(
        @Param('userId') id: string, 
        @Query('page') page: 1
    // ): Promise<{ hospitals: Hospital[]; count: number }> {
    ): Promise<Hospital[]> {
        await this.userService.assertExists(id);
        const [hospitals, count] = await this.hospitalService.findHospitalTreatments(id, page);
        // return { hospitals, count };
        return hospitals;
    }

    @Post(':userId/hospital-treatments')
    @Roles(Role.Doctor)
    async addHospitalTreatments( 
        @Param('userId') id: string,
        @Body() hospital: HospitalBindings
    ): Promise<Hospital>{      
        await this.userService.assertExists(id);
        return await this.hospitalService.addHospitalTreatment(hospital, id);
    }

    @Put('hospitals/:hospitalTreatmentId')
    @Roles(Role.Doctor)
    async editHospitalTreatments(
        @Param('hospitalTreatmentId') treatmentId: string,
        @Body() hospital: HospitalBindings
    ){
        return await this.hospitalService.editHospitalTreatments(treatmentId, hospital);
    }

    @Delete('hospitals/:hospitalTreatmentId')
    @Roles(Role.Doctor)
    async deleteHospitalTreatments(
        @Param('hospitalTreatmentId') treatmentId: string
    ): Promise<void>{
        await this.hospitalService.deleteHospitalTreatments(treatmentId);
    }



 }
