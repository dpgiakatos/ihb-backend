import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Personal } from './personal.entity';
import {Repository} from "typeorm";

@Injectable()
export class PersonalService {
    constructor(
        @InjectRepository(Personal)
        private personalRepository: Repository<Personal>
    ) {}

    
    findOne(id: number): Promise<Personal> {
        return this.personalRepository.findOne({id: id});
    }

    
    async create(personal: Personal) {
        const newPersonal = this.personalRepository.create({
            id: personal.id,
            firstName: personal.firstName,
            lastName: personal.lastName,
            ssnvs: personal.ssnvs,
            birthDate: personal.birthDate,
            county: personal.county,
            fatherFirstName: personal.fatherFirstName,
            fatherLastName: personal.fatherLastName,
            motherFirstName: personal.motherFirstName,
            motherLastName: personal.motherLastName,
            email: personal.email,
            mobilePhone: personal.mobilePhone,
            emergencyContact: personal.emergencyContact,
            user: personal.user
        });
        try {
            await this.personalRepository.save(newPersonal);
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: number): Promise<void> {
        await this.personalRepository.delete(id);
      }
}
