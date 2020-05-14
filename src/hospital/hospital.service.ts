import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from './hospital.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HospitalService {
    constructor(
        @InjectRepository(Hospital)
        private hospitalRepository: Repository<Hospital>
    ){}
}
