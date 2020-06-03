import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Allergic } from './allergic.entity';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { AllergicBindings } from './allergic.bindings';

@Injectable()
export class AllergicService {
    constructor(
        @InjectRepository(Allergic)
        private allergicRepository: Repository<Allergic>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}
    
    async findAllAllergic(userId: string, page: number) {
        return await this.allergicRepository.findAndCount({
            where: { user: { id: userId } },
            skip: (page * 10) - 10,
            take: 10,
            order: { id: 'ASC' }
        });
    }

    // async countAllergic(userId: string) {
    //     const cnt = await this.allergicRepository.count({user: userId});
    //     console.log(cnt);
    //     return cnt;
    // }

    async addAllergy(allergic: AllergicBindings, userId: string) {
        const newAllergic = this.allergicRepository.create({
            ...allergic,
            user: { id: userId }
        });
        return await this.allergicRepository.save(newAllergic);
    }


    async editAllergic(id: string, allergic: Allergic): Promise<Allergic> {
        const existing = await this.allergicRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        this.allergicRepository.merge(existing, allergic);
        return await this.allergicRepository.save(existing);
        // const req = await this.allergicRepository.findOne({ where: { id: id }, relations: ['user'] });
        // const extra = this.allergic(allergic, claims);
        // extra.id = id;
        // return await this.allergicRepository.save(extra);
        
    }

    // private allergic(allergic: Allergic, claims: Claims) {
    //     const user = this.userRepository.create();
    //     user.id = claims.id;
    //     const extra = this.allergicRepository.create();
    //     extra.name = allergic.name;
    //     extra.dDescription = allergic.dDescription;
    //     extra.tDescription = allergic.tDescription;
    //     extra.user = user.id;
    //     return extra;
    // }


    async deleteAllergic(id: string) {
        const existing = await this.allergicRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        await this.allergicRepository.remove(existing);
        // const req = await this.allergicRepository.findOne({ where: { id: id }, relations: ['user'] })
        //     const user = this.userRepository.create();
        //     user.id = claims.id;
        //     const extra = this.allergicRepository.create();
        //     extra.id = id;
        //     await this.allergicRepository.delete(extra);   
    }

    async getUserId(allergicId: string): Promise<string> {
        const userId = (await this.allergicRepository.findOne(allergicId))?.userId;

        if (!userId) {
            throw new NotFoundException();
        }

        return userId;
    }
}
