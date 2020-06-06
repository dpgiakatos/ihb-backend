import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Repository } from 'typeorm';
import { Claims } from '../auth/models/claims.interface';

@Injectable()
export  class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private applicationRepository: Repository<Application>
    ) { }

    async upload(claims: Claims, suffix: string) {
        const newFile = await this.applicationRepository.create({
            suffix: suffix,
            user: { id: claims.id }
        });
        await this.applicationRepository.save(newFile);
    }

    async assertExists(userId: string) {
        if (await this.applicationRepository.findOne({ where: { user: { id: userId } } })) {
            throw new NotFoundException();
        }
    }

    async getFileName(userId: string) {
        const file = await this.applicationRepository.findOne({ where: { user: { id: userId } } });
        return file?.user.id + '.' + file?.suffix;
    }

    async getApplications(page: number) {
        return await this.applicationRepository.createQueryBuilder( 'a')
            .select('a.id', 'id')
            .addSelect('a.userId', 'id')
            .addSelect('a.suffix', 'suffix')
            .addSelect('p.firstName', 'firstName')
            .addSelect('p.lastName', 'lastName')
            .innerJoin('user', 'u', 'a.userId=u.id')
            .innerJoin('personal', 'p', 'u.id = p.userId')
            .skip((page*10)-10)
            .take(10)
            .orderBy('p.lastName')
            .distinct(true)
            .getRawMany();
    }

    async delete(id: string) {
        const existing = await this.applicationRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        await this.applicationRepository.remove(existing);
    }
}
