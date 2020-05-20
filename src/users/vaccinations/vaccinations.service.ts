import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vaccine } from './vaccine.entity';
import { In, Repository } from 'typeorm';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

@Injectable()
export class VaccinationsService {

    constructor(
        @InjectRepository(Vaccine)
        private vaccinesRepository: Repository<Vaccine>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private usersService: UsersService
    ) { }

    async findAllVaccines(): Promise<Vaccine[]> {
        return await this.vaccinesRepository.find();
    }

    async getUserVaccinations(userId: string): Promise<Vaccine[]> {
        const user = await this.usersRepository.findOne(userId, { relations: ['vaccinations'] });
        return user.vaccinations;
    }

    async editVaccinations(updatedVaccines: { [key: string]: boolean }, userId: string) {
        const vaccinations = await this.vaccinesRepository.find({ where: {
            id: In(Object.keys(updatedVaccines).filter(vaccineId => updatedVaccines[vaccineId])) 
        } });
        const user = await this.usersService.findOneById(userId);
        user.vaccinations = vaccinations;
        await this.usersRepository.save(user);
    }

}
