import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vaccination } from './vaccination.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ExtraVaccination } from './extra_vaccination.entity';
import { Claims } from '../auth/models/claims.interface';
import { User as UserDec } from '../auth/decorators/user.decorator'
import { AddExtraVaccinationsBindingModel } from './models/vaccinations.bindings';
import { Auth } from '../auth/decorators/auth.decorator';

@Auth
@Controller('dashboard')
export class VaccinationsController {

    constructor(
        @InjectRepository(Vaccination)
        private vaccinationRepository: Repository<Vaccination>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ExtraVaccination)
        private extraVaccinationRepository: Repository<ExtraVaccination>
    ) {}

    @Get('vaccinations')
    findAllVaccines() {
        return this.vaccinationRepository.find();
    }

    @Get('user_vaccines')
    async getUserVaccines(@UserDec() claims: Claims) {
        const req = await this.userRepository.findOne( { where: { id: claims.id }, relations: ['vaccination'] });
        return req.vaccination;
    }

    @Post('edit_vaccinations')
    async editVaccinations(@Body() vaccines: { [key: string]: boolean }, @UserDec() claims: Claims) {
        const trueVaccines = [];
        const list = await this.vaccinationRepository.find({ where: { id: In(Object.keys(vaccines)) } });
        for (const value of list) {
            if (vaccines[value.id]) {
                trueVaccines.push(this.vaccinationRepository.create({ id: value.id }));
            }
        }
        const user = this.userRepository.create();
        user.id = claims.id;
        user.vaccination = trueVaccines;
        await this.userRepository.save(user);
    }

    @Get('extra_vaccinations/:page')
    async findExtraVaccinations(
        @Param('page', ParseIntPipe) page: number,
        @UserDec() claims: Claims
    ) {
        return await this.extraVaccinationRepository.find({
            where: { user: this.userRepository.create({ id: claims.id }) },
            skip: (page * 10) - 10,
            take: 10,
            order: { id: 'ASC' }
        });
    }

    @Get('count_extra_vaccinations')
    async countExtraVaccinations(@UserDec() claims: Claims) {
        return await this.extraVaccinationRepository.count({
            where: { user: this.userRepository.create({ id: claims.id }) }
        });
    }

    @Post('add_extra_vaccinations')
    async addExtraVaccinations(@Body() vaccine: AddExtraVaccinationsBindingModel, @UserDec() claims: Claims) {
        return await this.extraVaccinationRepository.save(this.extraVaccinations(vaccine, claims));
    }

    @Put('edit_extra_vaccinations/:id')
    async editExtraVaccinations(
        @Param('id', ParseIntPipe) id: number,
        @Body() vaccine: AddExtraVaccinationsBindingModel,
        @UserDec() claims: Claims
    ) {
        const extra = this.extraVaccinations(vaccine, claims);
        extra.id = id;
        return await  this.extraVaccinationRepository.save(extra);
    }

    @Delete('delete_extra_vaccinations/:id')
    async deleteExtraVaccinations(@Param('id', ParseIntPipe) id: number, @UserDec() claims: Claims) {
        const user = this.userRepository.create();
        user.id = claims.id;
        const extra = this.extraVaccinationRepository.create();
        extra.id = id;
        await this.extraVaccinationRepository.delete(extra);
    }

    private extraVaccinations(@Body() vaccine: AddExtraVaccinationsBindingModel, @UserDec() claims: Claims) {
        const user = this.userRepository.create();
        user.id = claims.id;
        const extra = this.extraVaccinationRepository.create();
        extra.name = vaccine.name;
        extra.date = new Date();
        extra.date.setFullYear(vaccine.date.year, vaccine.date.month-1, vaccine.date.day);
        extra.description = vaccine.description;
        extra.user = user;
        return extra;
    }
}
