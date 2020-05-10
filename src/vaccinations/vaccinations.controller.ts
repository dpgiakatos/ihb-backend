import { Body, Controller, Get, Post } from '@nestjs/common';
import { VaccinationsService } from './vaccinations.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Vaccination } from './vaccination.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ExtraVaccination } from './extra_vaccination.entity';
import { writeHeapSnapshot } from 'v8';

@Controller('dashboard')
export class VaccinationsController {

    constructor(
        private vaccinationsService: VaccinationsService,
        @InjectRepository(Vaccination)
        private vaccinationRepository: Repository<Vaccination>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ExtraVaccination)
        private extraVaccinationRepository: Repository<ExtraVaccination>
    ) {}

    @Get('vaccinations')
    findAllVaccines() {
        return this.vaccinationRepository.find();
    }

    @Get('user_vaccines')
    getUserVaccines() {
        const userId = '8ec0e29d-34d6-412c-a062-1a691fbbe4e5';
        // return this.userRepository.find( {select: ['vaccination'], where: {id: userId}, relations: ['vaccination']});
        return this.userRepository.createQueryBuilder('user')
            .select('userId')
            .where('user.id', {userId})
            .leftJoinAndSelect('user.vaccination', 'vaccination')
            .getMany();
    }

    @Post('edit_vaccinations')
    async editVaccinations(@Body() vaccines: any) {
        const userId = '8ec0e29d-34d6-412c-a062-1a691fbbe4e5';
        const trueVaccines = [];
        const list = await this.vaccinationRepository.find({where: {id: In(Object.keys(vaccines))}});
        for (const value of list) {
            if (vaccines[value.id]) {
                trueVaccines.push(this.vaccinationRepository.create({id: value.id}));
            }
        }
        const user = new User();
        user.id = userId;
        user.vaccination = trueVaccines;
        await this.userRepository.save(user);
    }

    @Get('extra_vaccinations')
    findAllExtraVaccines() {
        const userId = '8ec0e29d-34d6-412c-a062-1a691fbbe4e5';
        return this.userRepository.find({where: {id: userId}, relations: ['extraVaccination']});
    }

    @Post('add_extra_vaccinations')
    async addExtraVaccinations(@Body() vaccine: any) {
        const userId = '8ec0e29d-34d6-412c-a062-1a691fbbe4e5';
        const user = new User();
        user.id = userId;
        const extra = this.extraVaccinationRepository.create();
        extra.name = vaccine.name;
        extra.date = new Date();
        extra.date.setFullYear(vaccine.date.year, vaccine.date.month-1, vaccine.date.day);
        extra.description = vaccine.description;
        extra.user = user;
        console.log(vaccine);
        await this.extraVaccinationRepository.save(extra);
    }
}
