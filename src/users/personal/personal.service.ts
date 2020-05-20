import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Personal } from './personal.entity';
import { Repository, DeepPartial } from 'typeorm';
import { CreatePersonalBindings } from './personal.bindings';

@Injectable()
export class PersonalService {
    constructor(
        @InjectRepository(Personal)
        private personalRepository: Repository<Personal>
    ) {}

    findByUser(userId: string): Promise<Personal> {
        return this.personalRepository.findOne({ userId });
    }

    async create(personal: CreatePersonalBindings, userId: string) {
        const newPersonal = this.personalRepository.create(personal);
        newPersonal.userId = userId;
        await this.personalRepository.save(newPersonal);
    }

    async update(personal: DeepPartial<Personal>, userId: string) {
        const existing = await this.findByUser(userId);

        this.personalRepository.merge(existing, personal);

        await this.personalRepository.save(existing);
    }
}
