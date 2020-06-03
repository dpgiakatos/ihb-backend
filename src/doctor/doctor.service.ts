import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { Claims } from '../auth/models/claims.interface';
import { Alert } from './alert.entity';
import { PersonalService } from '../users/personal/personal.service';

@Injectable()
export class DoctorService {

    constructor(
        private personalService: PersonalService,
        @InjectRepository(Alert)
        private alertRepository: Repository<Alert>
    ) {}

    async find(search: string, country: string | undefined, claims: Claims) {
        if (search === '') {
            return [];
        }
        if (!country) {
            return await this.personalService.getRepository().find({
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
                ]
            });
        } else {
            return await this.personalService.getRepository().find({
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
                ]
            });
        }
    }

    async accessToUser(patientId: string, claims: Claims): Promise<void> {
        const alert = this.alertRepository.create({
            patient: { id: patientId },
            doctor: { id: claims.id }
        });
        await this.alertRepository.save(alert);
    }

    async hasAccess(patientId: string, claims:Claims): Promise<boolean> {
        const result = await this.alertRepository
            .createQueryBuilder('alert')
            .where('DATE(alert.accessTime) = CURDATE()')
            .andWhere('alert.patientId = :patient', { patient: patientId })
            .andWhere('alert.doctorId = :doctor', { doctor: claims.id })
            .getOne();
        if (result) {
            return true;
        }
        return false;
    }
}
