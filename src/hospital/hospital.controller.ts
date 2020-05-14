import { Controller, Post, Body, Get } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from './hospital.entity';
import { User } from 'src/auth/decorators/user.decorator';
import { Repository } from 'typeorm';
import { CreateHospitalBindings } from './hospital.bindings';
import { Claims } from 'src/auth/models/claims.interface';

@Controller('dashboard')
export class HospitalController {

    constructor(
        @InjectRepository(Hospital)
        private hospitalRepository: Repository<Hospital>,
    ){}

    @Post('hospitals')
    async getHospital(@Body() hospital: Hospital)
    {
        console.log(hospital);
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
        const newHospital = this.hospitalRepository.create(hospital);
        newHospital.user.id = user.id;
        await this.hospitalRepository.save(newHospital);
    }

    // @Delete('hospitals')

    // @Put('hospitals')


 }