import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Personal } from './personal.entity';
import { Repository } from 'typeorm';
import { Claims } from 'src/auth/models/claims.interface';
import { CreatePersonalBindings } from './personal.bindings';

@Injectable()
export class PersonalService {
    constructor(
        @InjectRepository(Personal)
        private personalRepository: Repository<Personal>
    ) {}

    findByUser(userId: string): Promise<Personal> {
        return this.personalRepository.findOne({ user: userId });
    }

    async create(personal: CreatePersonalBindings, userId: string) {
        const newPersonal = this.personalRepository.create(personal);   
        // newPersonal.birthDate.setFullYear(personal.birthDate.year, personal.birthDate.month-1, personal.birthDate.day);
        newPersonal.user = userId;
        await this.personalRepository.save(newPersonal);
        
    }

    async update(personal: CreatePersonalBindings, user: Claims) {
        const existing = await this.findByUser(user.id);

        Object.assign(existing, personal);

        if (!existing) {
            throw new NotFoundException();
        }

        await this.personalRepository.save(existing);
    }

    async remove(id: number): Promise<void> {
        await this.personalRepository.delete(id);
    }
}
