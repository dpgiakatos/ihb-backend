import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vaccination } from './vaccination.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ExtraVaccination } from './extra_vaccination.entity';
import { Claims } from '../auth/models/claims.interface';
import { AddExtraVaccinationsBindingModel } from './models/vaccinations.bindings';

@Injectable()
export class VaccinationsService {

    constructor(
        @InjectRepository(Vaccination)
        private vaccinationRepository: Repository<Vaccination>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ExtraVaccination)
        private extraVaccinationRepository: Repository<ExtraVaccination>
    ) {}

    async findAllVaccines():  Promise<Vaccination[]> {
        return await this.vaccinationRepository.find();
    }

    async getUserVaccines(userId: string) {
        const req = await this.userRepository.findOne( { where: { id: userId }, relations: ['vaccination'] });
        return req.vaccination;
    }

    async editVaccinations(vaccines: { [key: string]: boolean }, userId: string) {
        const trueVaccines = [];
        const list = await this.vaccinationRepository.find({ where: { id: In(Object.keys(vaccines)) } });
        for (const value of list) {
            if (vaccines[value.id]) {
                trueVaccines.push(this.vaccinationRepository.create({ id: value.id }));
            }
        }
        const user = this.userRepository.create();
        user.id = userId;
        user.vaccination = trueVaccines;
        console.log(user);
        await this.userRepository.save(user);
    }

    async findExtraVaccinations(page: number, userId: string) {
        return await this.extraVaccinationRepository.find({
            where: { user: this.userRepository.create({ id: userId }) },
            skip: (page * 10) - 10,
            take: 10,
            order: { id: 'ASC' }
        });
    }

    async countExtraVaccinations(userId: string) {
        return await this.extraVaccinationRepository.count({
            where: { user: this.userRepository.create({ id: userId }) }
        });
    }

    async addExtraVaccinations(vaccine: AddExtraVaccinationsBindingModel, userId: string) {
        return await this.extraVaccinationRepository.save(this.extraVaccinations(vaccine, userId));
    }

    async editExtraVaccinations(id: number, vaccine: AddExtraVaccinationsBindingModel, userId: string) {
        const req = await this.extraVaccinationRepository.findOne({ where: { id: id }, relations: ['user'] });
        if (req.user.id !== userId) {
            throw new UnauthorizedException();
        } else {
            const extra = this.extraVaccinations(vaccine, userId);
            extra.id = id;
            return await this.extraVaccinationRepository.save(extra);
        }
    }

    async deleteExtraVaccinations(id: number, userId: string) {
        const req = await this.extraVaccinationRepository.findOne({ where: { id: id }, relations: ['user'] })
        if (req.user.id !== userId) {
            throw new UnauthorizedException();
        } else {
            const user = this.userRepository.create();
            user.id = userId;
            const extra = this.extraVaccinationRepository.create();
            extra.id = id;
            await this.extraVaccinationRepository.delete(extra);
        }
    }

    private extraVaccinations(vaccine: AddExtraVaccinationsBindingModel, userId: string) {
        const user = this.userRepository.create();
        user.id = userId;
        const extra = this.extraVaccinationRepository.create();
        extra.name = vaccine.name;
        extra.date = new Date();
        extra.date.setFullYear(vaccine.date.year, vaccine.date.month-1, vaccine.date.day);
        extra.description = vaccine.description;
        extra.user = user;
        return extra;
    }
}
