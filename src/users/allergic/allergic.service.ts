import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Allergic } from './allergic.entity';
import { Repository } from 'typeorm';
import { AllergicBindings } from './allergic.bindings';
import { GetPaginationQuery } from '../../helpers/pagination-query';

@Injectable()
export class AllergicService {
    constructor(
        @InjectRepository(Allergic)
        private allergicRepository: Repository<Allergic>
    ) { }

    async findAllAllergic(userId: string, page: number) {
        return await this.allergicRepository.findAndCount({
            where: { user: { id: userId } },
            ...GetPaginationQuery(page, 10, { id: 'ASC' })
        });
    }

    async addAllergy(allergic: AllergicBindings, userId: string) {
        const newAllergic = this.allergicRepository.create({
            ...allergic,
            user: { id: userId }
        });
        return await this.allergicRepository.save(newAllergic);
    }

    async editAllergic(id: string, allergic: Allergic): Promise<Allergic> {
        const existing = await this.allergicRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        this.allergicRepository.merge(existing, allergic);
        return await this.allergicRepository.save(existing); 
    }

    async deleteAllergic(id: string) {
        const existing = await this.allergicRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        await this.allergicRepository.remove(existing);
    }

    async getUserId(allergicId: string): Promise<string> {
        const userId = (await this.allergicRepository.findOne(allergicId))?.userId;
        if (!userId) {
            throw new NotFoundException();
        }
        return userId;
    }
}
