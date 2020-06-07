import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Repository } from 'typeorm';
import { Claims } from '../auth/models/claims.interface';
import { unlink } from 'fs';

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
        if (!(await this.applicationRepository.findOne({ where: { user: { id: userId } } }))) {
            throw new NotFoundException();
        }
    }

    async hasApplication(userId: string) {
        if (await this.applicationRepository.findOne({ where: { user: { id: userId } } })) {
            return false;
        }
        return true;
    }

    async getFileName(userId: string) {
        const application = await this.applicationRepository.findOne({ where: { user: { id: userId } } });
        const file = userId + '.' + application?.suffix;
        return file;
    }

    async getApplications(page: number) {
        return [
            await this.applicationRepository.query(
                'select distinct application.id, application.userId, application.suffix, application.createdTime, personal.firstName, personal.lastName\n' +
                'from application inner join user on application.userId=user.id\n' +
                'inner join personal on user.id=personal.userId\n' +
                'where application.id not in (\n' +
                'select distinct application.id\n' +
                'from application inner join user on application.userId=user.id\n' +
                'inner join role on user.id=role.userId\n' +
                'where role.role=\'Doctor\')\n' +
                'order by application.createdTime\n' +
                'limit ?, ?', [(page*10)-10, 10]
                ),
            await this.applicationRepository.query(
                'select distinct count(application.id) as count\n' +
                'from application inner join user on application.userId=user.id\n' +
                'where application.id not in (\n' +
                'select distinct application.id\n' +
                'from application inner join user on application.userId=user.id\n' +
                'inner join role on user.id=role.userId\n' +
                'where role.role=\'Doctor\')'
                )
        ];
    }

    async delete(userId: string) {
        const existing = await this.applicationRepository.findOne({ where: { user: { id: userId } } });
        if (!existing) {
            throw new NotFoundException();
        }
        try {
            await unlink('applications\\' + userId + '.' + existing.suffix, async (err) => {
                if (err) {
                    throw new NotFoundException();
                } else {
                    await this.applicationRepository.remove(existing);
                }
            });
        } catch (e) {
            throw new NotFoundException();
        }
    }
}
