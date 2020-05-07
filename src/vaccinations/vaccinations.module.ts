import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Vaccination} from "./vaccination.entity"
import {VaccinationsService} from "./vaccinations.service";
import {VaccinationsController} from "./vaccinations.controller";
import {ExtraVaccination} from "./extra_vaccination.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Vaccination, ExtraVaccination])],
    providers: [VaccinationsService],
    controllers: [VaccinationsController]
})
export class VaccinationsModule {}