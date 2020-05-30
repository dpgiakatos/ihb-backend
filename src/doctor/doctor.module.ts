import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { Alert } from './alert.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alert]), UsersModule],
  controllers: [DoctorController],
  providers: [DoctorService]
})
export class DoctorModule {}
