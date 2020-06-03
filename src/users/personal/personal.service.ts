import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
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

    async findByUser(userId: string): Promise<Personal> {
        const personal = await this.personalRepository.findOne({ userId });

        if(!personal) {
            throw new NotFoundException();
        }

        return personal;
    }

    async create(personal: CreatePersonalBindings, userId: string) {
        const newPersonal = this.personalRepository.create(personal);
        newPersonal.userId = userId;
        await this.personalRepository.save(newPersonal);
    }

    async update(personal: DeepPartial<Personal>, userId: string) {
        const existing = await this.findByUser(userId);

        if (!existing) {
            throw new UnauthorizedException();
        }

        this.personalRepository.merge(existing, personal);

        await this.personalRepository.save(existing);
    }

    getRepository(): Repository<Personal> {
        return this.personalRepository;
    }
}
