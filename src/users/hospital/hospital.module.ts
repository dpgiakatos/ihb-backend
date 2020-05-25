import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from './hospital.entity'
import { HospitalController } from './hospital.controller';
import { UsersModule } from '../users.module';
import { HospitalService } from './hospital.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital]), UsersModule], 
  providers: [HospitalService],
  controllers: [HospitalController],
  exports: [TypeOrmModule]
})
export class HospitalModule { }
