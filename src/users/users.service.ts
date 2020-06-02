import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async editPassword(userId: string, oldPassword: string,newPassword: string){
        const existing = await this.usersRepository.findOne(userId);
        if (!existing) {
            throw new NotFoundException();
        }
        else if (await compare(oldPassword, existing.password)){
            existing.password = await hash(newPassword, 10);
            this.usersRepository.save(existing);
        }
        else {
            throw new UnauthorizedException();
        }
    }


    async assertExists(id: string) {
        if(!(await this.usersRepository.find({ id }))) {
            throw new NotFoundException();
        }
    }

    async findOneById(id: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ id });
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ email });
    }

    async create(email: string, password: string): Promise<User> {
        const newUser = this.usersRepository.create({
            email,
            password: await hash(password, 10)
        });

        return this.usersRepository.save(newUser);
    }
}
