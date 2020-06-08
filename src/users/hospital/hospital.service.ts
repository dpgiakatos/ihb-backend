import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HospitalBindings } from './hospital.bindings';
import { GetPaginationQuery } from '../../helpers/pagination-query';
import { HospitalTreatment } from './hospital.entity';

@Injectable()
export class HospitalService {
    constructor(
        @InjectRepository(HospitalTreatment)
        private treatmentRepository: Repository<HospitalTreatment>
    ){ }

    async addHospitalTreatment(hospital: HospitalBindings, userId: string): Promise<HospitalTreatment> {
        const newHospitalTreatment = this.treatmentRepository.create({
            ...hospital,
            user: { id: userId }
        });
        return await this.treatmentRepository.save(newHospitalTreatment);
    }

    async getUserTreatments(userId: string)
    {
        return this.treatmentRepository.findOne({ userId });
    }

    async findHospitalTreatments(userId: string, page: number) {
        return await this.treatmentRepository.findAndCount({
            where: { user: { id: userId } },
            ...GetPaginationQuery(page, 10, { starts: 'ASC' })
        });
    }

    async editHospitalTreatments(id: string, treatment: HospitalBindings): Promise<HospitalTreatment>
    {
        const existing = await this.treatmentRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        this.treatmentRepository.merge(existing, treatment);
        return await this.treatmentRepository.save(existing);
    }

    async deleteHospitalTreatments(id: string): Promise<void>
    {
        const existing = await this.treatmentRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        await this.treatmentRepository.remove(existing);
    }

    async getUserId(treatmentId: string): Promise<string> {
        const userId = (await this.treatmentRepository.findOne(treatmentId))?.userId;

        if(!userId) {
            throw new NotFoundException();
        }

        return userId;
    }
}
