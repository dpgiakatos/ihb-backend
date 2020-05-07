import {Controller, Get} from '@nestjs/common';
import {VaccinationsService} from "./vaccinations.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Vaccination} from "./vaccination.entity";
import {Repository} from "typeorm";

@Controller('dashboard')
export class VaccinationsController {

    constructor(
        private vaccinationsService: VaccinationsService,
        @InjectRepository(Vaccination)
        private vaccinationRepository: Repository<Vaccination>
    ) {}

    @Get('vaccinations')
    findAll() {
        return this.vaccinationRepository.find();
    }

    /*async create(vaccination: Vaccination) {
        const newVaccination = this.vaccinationRepository.create({
            name: vaccination.name
        });
        try {
            await this.vaccinationRepository.save(newVaccination);
        } catch (e) {
            console.log(e);
        }
    }*/
}
