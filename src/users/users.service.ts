import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {hash} from "bcrypt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    findOne(email: string): Promise<User> {
        return this.usersRepository.findOne({email: email});
    }

    async create(user: User) {
        this.usersRepository.create({id: user.id, email: user.email, password: await hash(user.password, 10)});
    }
}
