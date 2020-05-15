import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Allergic } from './allergic.entity';
import {Repository} from "typeorm";
import { Claims } from 'src/auth/models/claims.interface';
import { stringify } from 'querystring';
import { User } from 'src/users/user.entity';
import { AllergicModule } from './allergic.module';

@Injectable()
export class AllergicService {
    constructor(
        @InjectRepository(Allergic)
        private allergicRepository: Repository<Allergic>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}
    
    async findAllAllergic(userId: string): Promise<any> {
        return await this.allergicRepository.find({user: userId});
    }

    async countAllergic(userId: string) {
        const cnt = await this.allergicRepository.count({user: userId});
        console.log(cnt);
        return cnt;
    }

    async create(allergic: Allergic, user: Claims) {
        return await this.allergicRepository.save(this.allergic(allergic, user));
        // const newAllergic = this.allergicRepository.create();   
        // newAllergic.name = allergic.name;
        // newAllergic.dDescription = allergic.dDescription;
        // newAllergic.tDescription = allergic.tDescription;
        // newAllergic.user = user.id
        // try {
        //     return await this.allergicRepository.save(newAllergic);
        // } catch (e) {
        //     console.log(e);
        // }
    }

    async update(allergic: any, user: Claims) {
    
    }



    async editAllergic(id: number, allergic: Allergic, claims: Claims) {
        const req = await this.allergicRepository.findOne({ where: { id: id }, relations: ['user'] });
        // if (req.user.id !== claims.id) {
        //     throw new UnprocessableEntityException({
        //         failingConstraints: {
        //             all: [{
        //                 constraint: 'idDoNotMatch'
        //             }]
        //         }
        //     });
        // } else {
        //     const extra = this.extraVaccinations(vaccine, claims);
        //     extra.id = id;
        //     return await this.extraVaccinationRepository.save(extra);
        // }
        const extra = this.allergic(allergic, claims);
        extra.id = id;
        return await this.allergicRepository.save(extra);
        
    }


    private allergic(allergic: Allergic, claims: Claims) {
        const user = this.userRepository.create();
        user.id = claims.id;
        const extra = this.allergicRepository.create();
        extra.name = allergic.name;
        extra.dDescription = allergic.dDescription;
        extra.tDescription = allergic.tDescription;
        extra.user = user.id;
        return extra;
    }


    async deleteAllergic(id: number, claims: Claims) {
        const req = await this.allergicRepository.findOne({ where: { id: id }, relations: ['user'] })
        // if (req.user !== claims.id) {
        //     throw new UnprocessableEntityException({
        //         failingConstraints: {
        //             all: [{
        //                 constraint: 'idDoNotMatch'
        //             }]
        //         }
        //     });
        // } else {
        //     const user = this.userRepository.create();
        //     user.id = claims.id;
        //     const extra = this.allergicRepository.create();
        //     extra.id = id;
        //     await this.allergicRepository.delete(extra);
        // }
            const user = this.userRepository.create();
            user.id = claims.id;
            const extra = this.allergicRepository.create();
            extra.id = id;
            await this.allergicRepository.delete(extra);
        
    }
}