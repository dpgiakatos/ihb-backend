import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { Vaccine } from './vaccinations/vaccine.entity';
import { ExtraVaccination } from './extra-vaccinations/extra-vaccination.entity';
import { VaccinationsController } from './vaccinations/vaccinations.controller';
import { ExtraVaccinationsController } from './extra-vaccinations/extra-vaccinations.controller';
import { VaccinationsService } from './vaccinations/vaccinations.service';
import { ExtraVaccinationsService } from './extra-vaccinations/extra-vaccinations.service';
import { Personal } from './personal/personal.entity';
import { PersonalService } from './personal/personal.service';
import { PersonalController } from './personal/personal.controller';
import { Allergic } from './allergic/allergic.entity';
import { HospitalTreatment } from './hospital/hospital.entity';
import { AllergicService } from './allergic/allergic.service';
import { HospitalService } from './hospital/hospital.service';
import { AllergicController } from './allergic/allergic.controller';
import { HospitalController } from './hospital/hospital.controller';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Personal, Vaccine, ExtraVaccination, Allergic, HospitalTreatment]), DoctorModule],
  providers: [UsersService, PersonalService, VaccinationsService, ExtraVaccinationsService, AllergicService, HospitalService],
  controllers: [UsersController, PersonalController, VaccinationsController, ExtraVaccinationsController, AllergicController, HospitalController],
  exports: [UsersService, PersonalService, TypeOrmModule]
})
export class UsersModule {}
