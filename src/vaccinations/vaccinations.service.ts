import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vaccination } from './vaccination.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ExtraVaccination } from './extra_vaccination.entity';
import { Claims } from '../auth/models/claims.interface';
import { AddExtraVaccinationsBindingModel } from './models/vaccinations.bindings';
import { UnprocessableEntityException } from '../helpers/unprocessable-entity-exception.interface';

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

    async getUserVaccines(claims: Claims) {
        const req = await this.userRepository.findOne( { where: { id: claims.id }, relations: ['vaccination'] });
        return req.vaccination;
    }

    async editVaccinations(vaccines: { [key: string]: boolean }, claims: Claims) {
        const trueVaccines = [];
        const list = await this.vaccinationRepository.find({ where: { id: In(Object.keys(vaccines)) } });
        for (const value of list) {
            if (vaccines[value.id]) {
                trueVaccines.push(this.vaccinationRepository.create({ id: value.id }));
            }
        }
        const user = this.userRepository.create();
        user.id = claims.id;
        user.vaccination = trueVaccines;
        await this.userRepository.save(user);
    }

    async findExtraVaccinations(page: number, claims: Claims) {
        return await this.extraVaccinationRepository.find({
            where: { user: this.userRepository.create({ id: claims.id }) },
            skip: (page * 10) - 10,
            take: 10,
            order: { id: 'ASC' }
        });
    }

    async countExtraVaccinations(claims: Claims) {
        return await this.extraVaccinationRepository.count({
            where: { user: this.userRepository.create({ id: claims.id }) }
        });
    }

    async addExtraVaccinations(vaccine: AddExtraVaccinationsBindingModel, claims: Claims) {
        return await this.extraVaccinationRepository.save(this.extraVaccinations(vaccine, claims));
    }

    async editExtraVaccinations(id: number, vaccine: AddExtraVaccinationsBindingModel, claims: Claims) {
        const req = await this.extraVaccinationRepository.findOne({ where: { id: id }, relations: ['user'] });
        if (req.user.id !== claims.id) {
            throw new UnauthorizedException();
        } else {
            const extra = this.extraVaccinations(vaccine, claims);
            extra.id = id;
            return await this.extraVaccinationRepository.save(extra);
        }
    }

    async deleteExtraVaccinations(id: number, claims: Claims) {
        const req = await this.extraVaccinationRepository.findOne({ where: { id: id }, relations: ['user'] })
        if (req.user.id !== claims.id) {
            throw new UnauthorizedException();
        } else {
            const user = this.userRepository.create();
            user.id = claims.id;
            const extra = this.extraVaccinationRepository.create();
            extra.id = id;
            await this.extraVaccinationRepository.delete(extra);
        }
    }

    private extraVaccinations(vaccine: AddExtraVaccinationsBindingModel, claims: Claims) {
        const user = this.userRepository.create();
        user.id = claims.id;
        const extra = this.extraVaccinationRepository.create();
        extra.name = vaccine.name;
        extra.date = new Date();
        extra.date.setFullYear(vaccine.date.year, vaccine.date.month-1, vaccine.date.day);
        extra.description = vaccine.description;
        extra.user = user;
        return extra;
    }
}
