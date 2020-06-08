import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraVaccination } from './extra-vaccination.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateExtraVaccinationBindingModel, AddExtraVaccinationBindingModel } from './extra-vaccinations.bindings';

import { GetPaginationQuery } from '../../helpers/pagination-query';

@Injectable()
export class ExtraVaccinationsService { 
    constructor(
        @InjectRepository(ExtraVaccination)
        private extraVaccinationsRepository: Repository<ExtraVaccination>
    ) { }

    async findExtraVaccinations(userId: string, page: number) {
        return await this.extraVaccinationsRepository.findAndCount({
            where: { user: { id: userId } },
            ...GetPaginationQuery(page, 10, { date: 'ASC' })
        });
    }

    async addExtraVaccination(vaccination: AddExtraVaccinationBindingModel, userId: string): Promise<ExtraVaccination> {
        const newVaccination = this.extraVaccinationsRepository.create({
            ...vaccination,
            user: { id: userId }
        });
        return await this.extraVaccinationsRepository.save(newVaccination);
    }

    async editExtraVaccination(id: string, vaccination: UpdateExtraVaccinationBindingModel): Promise<ExtraVaccination> {
        const existing = await this.extraVaccinationsRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        this.extraVaccinationsRepository.merge(existing, vaccination);
        return await this.extraVaccinationsRepository.save(existing);
    }

    async deleteExtraVaccination(id: string): Promise<void> {
        const existing = await this.extraVaccinationsRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        await this.extraVaccinationsRepository.remove(existing);
    }

    async getUserId(vaccineId: string): Promise<string> {
        const userId = (await this.extraVaccinationsRepository.findOne(vaccineId))?.userId;
        if (!userId) {
            throw new NotFoundException();
        }
        return userId;
    }
}
