import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from './hospital.entity';
import { User } from '../user.entity'
import { HospitalBindings } from './hospital.bindings';

@Injectable()
export class HospitalService {
    constructor(
        @InjectRepository(Hospital)
        private hospitalRepository: Repository<Hospital>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    // private hospitalTreatments(hospital: HospitalBindings, claims: Claims) {
        // const user = this.userRepository.create();
        // user.id = claims.id;
        // const temp = this.hospitalRepository.create();
        // temp.name = hospital.name;
        // temp.city = hospital.city;
        // temp.country = hospital.country;
        // temp.cause = hospital.cause;
        // temp.treatment = hospital.treatment;
        // temp.start = new Date();
        // temp.start.setFullYear(hospital.start.year, hospital.start.month - 1, hospital.start.day);
        // temp.end = new Date();
        // temp.end.setFullYear(hospital.end.year, hospital.end.month - 1, hospital.end.day);
        // temp.user = user;
        // return temp;
    // }

    async addHospitalTreatment(hospital: HospitalBindings, userId: string): Promise<Hospital> {
        const newHospitalTreatment = this.hospitalRepository.create({
            ...hospital,
            user: { id: userId }
        });
        return await this.hospitalRepository.save(newHospitalTreatment);
    }

    // async countHospitalTreatments(page: number, user: Claims){
    //     return await this.hospitalRepository.find({
    //         where: { user: this.userRepository.create({ id: user.id } ) },
    //         skip: (page * 10) - 10,
    //         take: 10,
    //         order: { id: 'ASC' }
    //     });
    // }

    async getUserTreatments(userId: string)
    {
        return this.hospitalRepository.findOne({ userId });
    }

    async findHospitalTreatments(userId: string, page: number) {
        return await this.hospitalRepository.findAndCount({
            where: { user: { id: userId } },
            skip: (page * 10) - 10,
            take: 10,
            order: { id: 'ASC' }
        })
    }

    async editHospitalTreatments(id: string, hospital: HospitalBindings): Promise<Hospital>
    {
        const existing = await this.hospitalRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        this.hospitalRepository.merge(existing, hospital);
        return await this.hospitalRepository.save(existing);
        // const req = await this.hospitalRepository.findOne({
        //     where: { id: id },
        //     relations: ['user']
        // });
        // if (req.user.id !== user.id)
        // {
        //     throw new UnprocessableEntityException({
        //         failingConstraints: {
        //             all: [{
        //                 constraint: 'idDoNotMatch'
        //             }]
        //         }
        //     })
        // } else {
        //     const temp = this.hospitalTreatments(hospital, user);
        //     temp.id = id;
        //     return await this.hospitalRepository.save(temp);
        // }
    }

    async deleteHospitalTreatments(id: string): Promise<void>
    {
        const existing = await this.hospitalRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        await this.hospitalRepository.remove(existing);
        // const req = await this.hospitalRepository.findOne({
        //     where: { id: id},
        //     relations: ['user']
        // });
        // if (req.user.id !== user.id)
        // {
        //     throw new UnprocessableEntityException({
        //         failingConstraints: {
        //             all: [{
        //                 constraint: 'idDoNotMatch'
        //             }]
        //         }
        //     })
        // } else {
        //     const temp = this.hospitalRepository.create()
        //     temp.id = id;
        //     await this.hospitalRepository.delete(temp);
        // }
    }

    async getUserId(treatmentId: string): Promise<string> {
        const userId = (await this.hospitalRepository.findOne(treatmentId))?.userId;

        if(!userId) {
            throw new NotFoundException();
        }

        return userId;
    }
}
