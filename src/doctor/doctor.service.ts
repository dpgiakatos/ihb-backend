import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claims, Role } from '../auth/models/claims.interface';
import { Alert } from './alert.entity';
import { PersonalService } from '../users/personal/personal.service';
import { AlertLog } from './doctor.bindings';

@Injectable()
export class DoctorService {

    constructor(
        private personalService: PersonalService,
        @InjectRepository(Alert)
        private alertRepository: Repository<Alert>
    ) {}

    async find(search: string, country: string | undefined, claims: Claims, page: number) {
        if (search === '') {
            return [];
        }
        if (!country) {
            return await this.personalService.patientSearchingWithoutFilters(search, claims, page);
        } else {
            return await this.personalService.patientSearchingWithFilters(search, country, claims, page);
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
        if (patientId === claims.id && claims.roles.some(r => r === Role.Doctor)) { // Doctors can edit their own data
            return true;
        }
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

    async getUserAlerts(claims: Claims): Promise<AlertLog[]> {
        return await this.alertRepository.createQueryBuilder( 'a')
            .select('a.accessTime', 'accessTime')
            .addSelect('p.firstName', 'firstName')
            .addSelect('p.lastName', 'lastName')
            .innerJoin('user', 'u', 'a.doctor=u.id')
            .innerJoin('personal', 'p', 'u.id = p.user')
            .where('a.patient = :patientId', { patientId: claims.id })
            .orderBy('a.accessTime')
            .getRawMany();
    }
}
