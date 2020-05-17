import { Controller, Post, Body, Get, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from './hospital.entity';
import { User } from 'src/auth/decorators/user.decorator';
import { Repository } from 'typeorm';
import { CreateHospitalBindings } from './hospital.bindings';
import { Claims } from 'src/auth/models/claims.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth
@Controller('dashboard')
export class HospitalController {

    constructor(
        private hospitalService: HospitalService,
        @InjectRepository(Hospital)
        private hospitalRepository: Repository<Hospital>,
    ){}

    @Get('hospitals:page')
    async getSomeTreatments(
        @Param('page', ParseIntPipe) page: number, 
        @User() user: Claims
    ){
        return await this.hospitalService.countHospitalTreatments(page, user);
    }

    @Get('user_treatments')
    async getUserTreatments(@User() user: Claims)
    {
        return await this.hospitalService.getUserTreatments(user);
    }

    @Get('hospitals')
    getHospitalsTreatments() {
        return this.hospitalRepository.find();
    }

    @Post('hospitals')
    async addHospitalTreatments( 
        @Body() hospital: CreateHospitalBindings,
        @User() user: Claims
    ){      
        return await this.hospitalService.addHospitalTreatment(hospital, user);
    }

    @Put('hospitals/:id')
    async editHospitalTreatments(
        @Param('id', ParseIntPipe) id: number,
        @Body() hospital: CreateHospitalBindings,
        @User() user: Claims
    ){
        return await this.hospitalService.editHospitalTreatments( id, hospital, user);
    }

    @Delete('hospitals/:id')
    async deleteHospitalTreatments(
        @Param('id', ParseIntPipe) id: number,
        @User() user: Claims
    ){
        await this.hospitalService.deleteHospitalTreatments(id, user);
    }



 }