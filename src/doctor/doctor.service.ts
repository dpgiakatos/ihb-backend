import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Personal } from '../users/personal/personal.entity';
import { Like, Not, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Claims } from '../auth/models/claims.interface';
import { Alert } from './alert.entity';

@Injectable()
export class DoctorService {

    constructor(
        @InjectRepository(Personal)
        private personalRepository: Repository<Personal>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Alert)
        private alertRepository: Repository<Alert>
    ) {}

    async find(search: string, country: string, claims: Claims) {
        if (search === '') {
            return [];
        }
        if (!country) {
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
                ]
            });
        } else {
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
                ]
            });
        }
    }

    async accessToUser(patientId: string, claims: Claims) {
        const alert = this.alertRepository.create({
            patient: { id: patientId },
            doctor: { id: claims.id }
        });
        await this.alertRepository.save(alert);
    }
}
