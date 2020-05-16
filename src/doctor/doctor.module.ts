import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Personal } from '../personal/personal.entity';
import { User } from '../users/user.entity';
import { DoctorController } from './doctor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Personal, User])],
  controllers: [DoctorController],
  providers: [DoctorService]
})
export class DoctorModule {}
