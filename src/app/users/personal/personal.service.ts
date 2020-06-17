import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Personal } from './personal.entity';
import { Repository, DeepPartial, Brackets } from 'typeorm';
import { CreatePersonalBindings } from './personal.bindings';
import { Role } from '../../../auth/models/claims.interface';

@Injectable()
export class PersonalService {
    constructor(
        @InjectRepository(Personal)
        private personalRepository: Repository<Personal>
    ) {}

    async findByUser(userId: string): Promise<Personal> {
        const personal = await this.personalRepository.findOne({ userId });

        if (!personal) {
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

    async findByFiltering(page: number, filters?: { country?: string, role?: Role | Role[], search?: string, exceptId?: string }): Promise<[Personal[], number]> {

        const query = this.personalRepository.createQueryBuilder('p');
        if (filters?.role) {
            query.innerJoin('user', 'u', 'p.userId=u.id')
                .innerJoin('role', 'r', 'u.id = r.userId');
            if(Array.isArray(filters?.role)) {
                const roles = filters?.role;
                query.andWhere(new Brackets(qb => {
                    for(const role of roles) {
                        qb.orWhere('r.role = :role', { role });
                    }
                }));
            } else {
                query.andWhere('r.role = :role', { role: filters.role });
            }
        }

        if(filters?.search) {
            const search = filters.search;
            query.andWhere(new Brackets(qb => {
                qb.where('p.firstName like :firstName', { firstName: '%' + search + '%' });
                qb.orWhere('p.lastName like :lastName', { lastName: '%' + search + '%' });
            }))
        }

        if(filters?.country) {
            query.andWhere('p.country = :country', { country: filters.country });
        }

        return [
            await query
                .take(10)
                .skip((page - 1)* 10)
                .orderBy('p.lastName')
                .distinct(true)
                .getMany(),
            await query
                .distinct(true)
                .getCount()
        ];
    }

    async getSelectedUser(userId: string) {
        return await this.personalRepository.createQueryBuilder('p')
            .select('p.firstName', 'firstName')
            .addSelect('p.lastName', 'lastName')
            .addSelect('u.email', 'email')
            .innerJoin('user', 'u', 'p.userId=u.id')
            .where('p.userId = :id', { id: userId })
            .getRawOne();
    }
}

