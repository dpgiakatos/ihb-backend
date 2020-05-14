import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Allergic } from './allergic.entity';
import {Repository} from "typeorm";
import { Claims } from 'src/auth/models/claims.interface';
import { stringify } from 'querystring';

@Injectable()
export class AllergicService {
    constructor(
        @InjectRepository(Allergic)
        private allergicRepository: Repository<Allergic>
    ) {}
    
    async findAllAllergic(userId: string): Promise<any> {
        return await this.allergicRepository.find({user: userId});
    }

    async countAllergic(userId: string) {
        const cnt = await this.allergicRepository.count({user: userId});
        return cnt;
    }

    async create(allergic: any, user: Claims) {
        const newAllergic = this.allergicRepository.create();   
        newAllergic.name = allergic.name;
        newAllergic.dDescription = allergic.dDescription;
        newAllergic.tDescription = allergic.tDescription;
        newAllergic.user = user.id
        try {
            await this.allergicRepository.save(newAllergic);
        } catch (e) {
            console.log(e);
        }
    }

    async update(allergic: any, user: Claims) {
    
    }

    async remove(id: number): Promise<void> {
    
    }
}