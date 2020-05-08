import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async findOne(email: string): Promise<User> {
        return this.usersRepository.findOne({ email: email });
    }

    async create(email: string, password: string): Promise<User> {
        
        const existingUser = await this.findOne(email);

        if(existingUser) {
            throw new BadRequestException('Email already exists');
        }
        
        const newUser = this.usersRepository.create({
            email,
            password: await hash(password, 10)
        });

        return this.usersRepository.save(newUser);
    }
}
