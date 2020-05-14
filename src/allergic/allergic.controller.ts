import { Controller, Post, Body, Delete, Get, Put } from '@nestjs/common';
import { AllergicService } from './allergic.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Allergic } from './allergic.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/decorators/user.decorator';
import { Claims } from 'src/auth/models/claims.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth
@Controller('dashboard/allergic')
export class AllergicController {
  constructor(
    private allergicService: AllergicService,
    @InjectRepository(Allergic)
    private allergicRepository: Repository<Allergic>
  ) {}

  @Get()
  //change any to Allergic
  async getAllergic(@User() user: Claims): Promise<Allergic[]> {
    return await this.allergicService.findAllAllergic(user.id);
  }

  @Get('count_allergic')
    async countExtraVaccinations(@User() user: Claims) {
        return await this.allergicService.countAllergic(user.id);
    }

  @Post()
  async postAllergic(@Body() newAllergic: any, @User() user: Claims): Promise<void> {
    await this.allergicService.create(newAllergic, user);
  }

  @Delete()
  async remove(@User() user: Claims): Promise<void> {
    // await this.allergicRepository.delete({ user: user.id });
  }

  @Put()
  async putAllergic(@Body() newAllergic: any, @User() user: Claims): Promise<void> {
    // await this.allergicService.update(newAllergic, user);
  }
}