import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from './hospital.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity'
import { CreateHospitalBindings } from './hospital.bindings';
import { Claims } from '../auth/models/claims.interface';

@Injectable()
export class HospitalService {
    constructor(
        @InjectRepository(Hospital)
        private hospitalRepository: Repository<Hospital>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    private hospitalTreatments(hospital: CreateHospitalBindings, claims: Claims) {
        const user = this.userRepository.create();
        user.id = claims.id;
        const temp = this.hospitalRepository.create();
        temp.name = hospital.name;
        temp.city = hospital.city;
        temp.country = hospital.country;
        temp.cause = hospital.cause;
        temp.description = hospital.description;
        temp.start = new Date();
        temp.start.setFullYear(hospital.start.year, hospital.start.month - 1, hospital.start.day);
        temp.end = new Date();
        temp.end.setFullYear(hospital.end.year, hospital.end.month - 1, hospital.end.day);
        temp.user = user;
        return temp;
    }

    async addHospitalTreatment(hospital: CreateHospitalBindings, user: Claims) {
        return await this.hospitalRepository.save(this.hospitalTreatments(hospital, user));
    }

    async countHospitalTreatments(page: number, user: Claims){
        return await this.hospitalRepository.find({
            where: { user: this.userRepository.create({ id: user.id } ) },
            skip: (page * 10) - 10,
            take: 10,
            order: { id: 'ASC' }
        });
    }

    async getUserTreatments(user: Claims)
    {
        const temp = await this.userRepository.findOne( {
            where: { id: user.id },
            relations: ['hospital']
        });
        return temp.hospital;
    }

    async editHospitalTreatments(id: number, hospital: CreateHospitalBindings, user: Claims)
    {
        const req = await this.hospitalRepository.findOne({
            where: { id: id },
            relations: ['user']
        });
        if (req.user.id !== user.id)
        {
            throw new UnprocessableEntityException({
                failingConstraints: {
                    all: [{
                        constraint: 'idDoNotMatch'
                    }]
                }
            })
        } else {
            const temp = this.hospitalTreatments(hospital, user);
            temp.id = id;
            return await this.hospitalRepository.save(temp);
        }
    }

    async deleteHospitalTreatments(id: number, user: Claims)
    {
        const req = await this.hospitalRepository.findOne({
            where: { id: id},
            relations: ['user']
        });
        if (req.user.id !== user.id)
        {
            throw new UnprocessableEntityException({
                failingConstraints: {
                    all: [{
                        constraint: 'idDoNotMatch'
                    }]
                }
            })
        } else {
            const temp = this.hospitalRepository.create()
            temp.id = id;
            await this.hospitalRepository.delete(temp);
        }
    }

}
