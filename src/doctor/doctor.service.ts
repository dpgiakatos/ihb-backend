import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Personal } from '../personal/personal.entity';
import { Like, Not, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Claims, Role } from '../auth/models/claims.interface';

@Injectable()
export class DoctorService {

    constructor(
        @InjectRepository(Personal)
        private personalRepository: Repository<Personal>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async find(search: string, country: string, claims: Claims) {
        if (claims.roles.some(role => role === Role.Doctor)) {
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
    }
}
