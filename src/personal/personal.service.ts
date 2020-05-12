import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Personal } from './personal.entity';
import {Repository} from "typeorm";
import { Claims } from 'src/auth/models/claims.interface';
import { stringify } from 'querystring';

@Injectable()
export class PersonalService {
    constructor(
        @InjectRepository(Personal)
        private personalRepository: Repository<Personal>
    ) {}

    
    /*
    findOne(id: number): Promise<Personal> {
        return this.personalRepository.findOne({id: id});
    }
    */

    
    async create(personal: any, user: Claims) {
        const newPersonal = this.personalRepository.create();   
        newPersonal.firstName = personal.firstName;
        newPersonal.lastName = personal.lastName;
        newPersonal.ssnvs = personal.ssnvs;
        newPersonal.birthDate = new Date();
        newPersonal.birthDate.setFullYear(personal.birthDate.year, personal.birthDate.month-1, personal.birthDate.day);
        newPersonal.country = personal.country;
        newPersonal.fatherFirstName = personal.fatherFirstName;
        newPersonal.fatherLastName = personal.fatherLastName;
        newPersonal.motherFirstName = personal.motherFirstName;
        newPersonal.motherLastName = personal.motherLastName;
        newPersonal.email = personal.email;
        newPersonal.mobilePhone = personal.mobilePhone;
        newPersonal.emergencyContact = personal.emergencyContact;
        newPersonal.user = user.id
        try {
            await this.personalRepository.save(newPersonal);
        } catch (e) {
            console.log(e);
        }
    }

    async update(personal: any, user: Claims) {
        const existing = await this.personalRepository.findOne({
            where: {
                user: user.id
            }
        })

        existing.firstName = personal.firstName;
        existing.lastName = personal.lastName;
        existing.ssnvs = personal.ssnvs;
        existing.birthDate = new Date();
        existing.birthDate.setFullYear(personal.birthDate.year, personal.birthDate.month-1, personal.birthDate.day);
        existing.country = personal.country;
        existing.fatherFirstName = personal.fatherFirstName;
        existing.fatherLastName = personal.fatherLastName;
        existing.motherFirstName = personal.motherFirstName;
        existing.motherLastName = personal.motherLastName;
        existing.email = personal.email;
        existing.mobilePhone = personal.mobilePhone;
        existing.emergencyContact = personal.emergencyContact;

        try {
            await this.personalRepository.save(existing);
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: number): Promise<void> {
        await this.personalRepository.delete(id);
      }
}
