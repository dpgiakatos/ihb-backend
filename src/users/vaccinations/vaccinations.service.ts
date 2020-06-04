import { Injectable, NotFoundException } from '@nestjs/common';
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
        
        if(!user) {
            throw new NotFoundException();
        }

        return user.vaccinations!;
    }

    async editVaccinations(updatedVaccines: { [key: string]: boolean }, userId: string) {
        const user = await this.usersService.findOneById(userId);

        if(!user) {
            throw new NotFoundException();
        }

        const trueVaccines = Object.keys(updatedVaccines).filter(vaccineId => updatedVaccines[vaccineId]);
        if (trueVaccines.length) {
            const vaccinations = await this.vaccinesRepository.find({ where: {
                id: In(trueVaccines) 
            } });
            user.vaccinations = vaccinations;
        } else {
            user.vaccinations = [];
        }
        
        await this.usersRepository.save(user);
    }

}
