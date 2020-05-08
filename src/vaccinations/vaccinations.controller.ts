import { Body, Controller, Get, Post } from '@nestjs/common';
import { VaccinationsService } from './vaccinations.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Vaccination } from './vaccination.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { resolveConfigFile } from 'prettier';
import sync = resolveConfigFile.sync;

@Controller('dashboard')
export class VaccinationsController {

    constructor(
        private vaccinationsService: VaccinationsService,
        @InjectRepository(Vaccination)
        private vaccinationRepository: Repository<Vaccination>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    @Get('vaccinations')
    findAll() {
        return this.vaccinationRepository.find();
    }

    @Post('edit_vaccinations')
    async editVaccinations(@Body() vaccines: any) {
        const userId = '103c62f7-e330-44f9-844c-5f7447e8a024';
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

    /*async create(vaccination: Vaccination) {
        const newVaccination = this.vaccinationRepository.create({
            name: vaccination.name
        });
        try {
            await this.vaccinationRepository.save(newVaccination);
        } catch (e) {
            console.log(e);
        }
    }*/
}
