import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Personal } from './personal.entity';
import { Repository, DeepPartial, Like, Not } from 'typeorm';
import { CreatePersonalBindings } from './personal.bindings';
import { GetPaginationQuery } from '../../helpers/pagination-query';
import { Claims } from '../../auth/models/claims.interface';

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

    async patientSearchingWithoutFilters(search: string, claims: Claims, page: number) {
        return await this.personalRepository.find({
            select: [
                'firstName',
                'lastName',
                'ssnvs',
                'userId'
            ],
            where: [
                { firstName: Like('%' + search + '%'), userId: Not(claims.id) },
                { lastName: Like('%' + search + '%'), userId: Not(claims.id) },
                { ssnvs: Like('%' + search + '%'), userId: Not(claims.id) }
            ],
            ...GetPaginationQuery(page, 10)
        });
    }

    async patientSearchingWithFilters(search: string, country: string | undefined, claims: Claims, page: number) {
        return await this.personalRepository.find({
            select: [
                'firstName',
                'lastName',
                'ssnvs',
                'userId'
            ],
            where: [
                { firstName: Like('%' + search + '%'), country: country, userId: Not(claims.id) },
                { lastName: Like('%' + search + '%'), country: country, userId: Not(claims.id) },
                { ssnvs: Like('%' + search + '%'), country: country, userId: Not(claims.id) }
            ],
            ...GetPaginationQuery(page, 10)
        });
    }

    async findAllUsers(page: number) {
        return await this.personalRepository.findAndCount({
            select: ['firstName', 'lastName', 'userId'],
            ...GetPaginationQuery(page, 10)
        });
    }

    async findAllDoctors(page: number) {
        return await this.personalRepository.createQueryBuilder( 'p')
            .select('p.userId', 'id')
            .addSelect('p.firstName', 'firstName')
            .addSelect('p.lastName', 'lastName')
            .innerJoin('user', 'u', 'p.userId=u.id')
            .innerJoin('role', 'r', 'u.id = r.userId')
            .where('r.role = :doctor', { doctor: 'Doctor' })
            .skip((page*10)-10)
            .take(10)
            .orderBy('p.lastName')
            .distinct(true)
            .getRawMany();
    }

    async findAllAdministrators(page: number) {
        return await this.personalRepository.createQueryBuilder( 'p')
            .select('p.userId', 'id')
            .addSelect('p.firstName', 'firstName')
            .addSelect('p.lastName', 'lastName')
            .innerJoin('user', 'u', 'p.userId=u.id')
            .innerJoin('role', 'r', 'u.id = r.userId')
            .where('r.role = :administrator', { administrator: 'Administrator' })
            .skip((page*10)-10)
            .take(10)
            .orderBy('p.lastName')
            .getRawMany();
    }

    async findUsersWithRoleDoctorAndAdministrator(page: number) {
        return await this.personalRepository.createQueryBuilder( 'p')
            .select('p.userId', 'id')
            .addSelect('p.firstName', 'firstName')
            .addSelect('p.lastName', 'lastName')
            .innerJoin('user', 'u', 'p.userId=u.id')
            .innerJoin('role', 'rD', 'u.id = rD.userId and rD.role = :doctor', { doctor: 'Doctor' })
            .innerJoin('role', 'rA', 'u.id = rA.userId and rA.role = :administrator', { administrator: 'Administrator' })
            .skip((page*10)-10)
            .take(10)
            .orderBy('p.lastName')
            .distinct(true)
            .getRawMany();
    }

    async searchAllUsers(search: string, page: number) {
        return await this.personalRepository.findAndCount({
            select: [
                'userId',
                'firstName',
                'lastName'
            ],
            where: [
                { firstName: Like('%' + search + '%') },
                { lastName: Like('%' + search + '%') }
            ],
            ...GetPaginationQuery(page, 10)
        });
    }

    async searchAllDoctors(search: string, page: number) {
        return await this.personalRepository.createQueryBuilder( 'p')
            .select('p.userId', 'id')
            .addSelect('p.firstName', 'firstName')
            .addSelect('p.lastName', 'lastName')
            .innerJoin('user', 'u', 'p.userId=u.id')
            .innerJoin('role', 'r', 'u.id = r.userId')
            .where('p.firstName like :firstName', { firstName: '%' + search + '%' })
            .orWhere('p.lastName like :lastName', { lastName: '%' + search + '%' })
            .andWhere('r.role = :doctor', { doctor: 'Doctor' })
            .skip((page*10)-10)
            .take(10)
            .orderBy('p.lastName')
            .distinct(true)
            .getRawMany();
    }

    async searchAllAdministrators(search: string, page: number) {
        return await this.personalRepository.createQueryBuilder( 'p')
            .select('p.userId', 'id')
            .addSelect('p.firstName', 'firstName')
            .addSelect('p.lastName', 'lastName')
            .innerJoin('user', 'u', 'p.userId=u.id')
            .innerJoin('role', 'r', 'u.id = r.userId')
            .where('p.firstName like :firstName', { firstName: '%' + search + '%' })
            .orWhere('p.lastName like :lastName', { lastName: '%' + search + '%' })
            .andWhere('r.role = :administrator', { administrator: 'Administrator' })
            .skip((page*10)-10)
            .take(10)
            .orderBy('p.lastName')
            .getRawMany();
    }

    async searchUsersWithRoleDoctorAndAdministrator(search: string, page: number) {
        return await this.personalRepository.createQueryBuilder( 'p')
            .select('p.userId', 'id')
            .addSelect('p.firstName', 'firstName')
            .addSelect('p.lastName', 'lastName')
            .innerJoin('user', 'u', 'p.userId=u.id')
            .innerJoin('role', 'rD', 'u.id = rD.userId and rD.role = :doctor', { doctor: 'Doctor' })
            .innerJoin('role', 'rA', 'u.id = rA.userId and rA.role = :administrator', { administrator: 'Administrator' })
            .where('p.firstName like :firstName', { firstName: '%' + search + '%' })
            .orWhere('p.lastName like :lastName', { lastName: '%' + search + '%' })
            .skip((page*10)-10)
            .take(10)
            .orderBy('p.lastName')
            .distinct(true)
            .getRawMany();
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
