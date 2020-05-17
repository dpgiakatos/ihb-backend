import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Allergic } from './allergic.entity';
import {Repository} from "typeorm";
import { Claims } from 'src/auth/models/claims.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class AllergicService {
    constructor(
        @InjectRepository(Allergic)
        private allergicRepository: Repository<Allergic>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}
    
    async findAllAllergic(page: number, user: Claims): Promise<any> {
        return await this.allergicRepository.find({
            where: { user: this.userRepository.create({ id: user.id }) },
            skip: (page * 10) - 10,
            take: 10,
            order: { id: 'ASC' }
        });
    }

    async countAllergic(userId: string) {
        const cnt = await this.allergicRepository.count({user: userId});
        console.log(cnt);
        return cnt;
    }

    async create(allergic: Allergic, user: Claims) {
        return await this.allergicRepository.save(this.allergic(allergic, user));
    }


    async editAllergic(id: number, allergic: Allergic, claims: Claims) {
        const req = await this.allergicRepository.findOne({ where: { id: id }, relations: ['user'] });
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
            const user = this.userRepository.create();
            user.id = claims.id;
            const extra = this.allergicRepository.create();
            extra.id = id;
            await this.allergicRepository.delete(extra);   
    }
}