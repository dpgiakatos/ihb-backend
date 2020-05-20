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

@Module({
  imports: [TypeOrmModule.forFeature([User, Personal, Vaccine, ExtraVaccination])],
  providers: [UsersService, PersonalService, VaccinationsService, ExtraVaccinationsService],
  controllers: [UsersController, PersonalController, VaccinationsController, ExtraVaccinationsController],
  exports: [UsersService, PersonalService, TypeOrmModule]
})
export class UsersModule {}
