import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vaccination } from './vaccination.entity';
import { VaccinationsController } from './vaccinations.controller';
import { ExtraVaccination } from './extra_vaccination.entity';
import { User } from '../users/user.entity';
import { VaccinationsService } from './vaccinations.service';

@Module({
    imports: [TypeOrmModule.forFeature([Vaccination, ExtraVaccination, User])],
    controllers: [VaccinationsController],
    providers: [VaccinationsService]
})
export class VaccinationsModule {}