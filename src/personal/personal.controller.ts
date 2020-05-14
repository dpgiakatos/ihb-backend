import { Controller, Post, Body, Delete, Get, Put } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Personal } from './personal.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/decorators/user.decorator';
import { Claims } from 'src/auth/models/claims.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreatePersonalBindings, UpdatePersonalBindings } from './personal.bindings';

@Auth
@Controller('dashboard/personal')
export class PersonalController {
  constructor(
    private personalService: PersonalService,
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>
  ) {}

  @Get()
  async getPersonal(@User() user: Claims): Promise<Personal> {
    return await this.personalService.findByUser(user.id);
  }

  @Post()
  async postPersonal(@Body() newPersonal: CreatePersonalBindings, @User() user: Claims): Promise<void> {
    await this.personalService.create(newPersonal, user.id);
  }

  @Delete()
  async remove(@User() user: Claims): Promise<void> {
    await this.personalRepository.delete({ user: user.id });
  }

  @Put()
  async putPersonal(@Body() newPersonal: UpdatePersonalBindings, @User() user: Claims): Promise<void> {
    await this.personalService.update(newPersonal, user);
  }
}
