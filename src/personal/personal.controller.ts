import { Controller, Post, Body, Delete, Get, Put, MethodNotAllowedException } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { Personal } from './personal.entity';
import { User } from '../auth/decorators/user.decorator';
import { Claims } from '../auth/models/claims.interface';
import { Auth } from '../auth/decorators/auth.decorator';
import { UpdatePersonalBindings } from './personal.bindings';

@Auth
@Controller('dashboard/personal')
export class PersonalController {
  constructor(private personalService: PersonalService) { }

  @Get()
  async getPersonal(@User() user: Claims): Promise<Personal> {
    return await this.personalService.findByUser(user.id);
  }

  @Post()
  async postPersonal(): Promise<void> {
    throw new MethodNotAllowedException();
  }

  @Delete()
  async remove(): Promise<void> {
    throw new MethodNotAllowedException();
  }

  @Put()
  async putPersonal(@Body() newPersonal: UpdatePersonalBindings, @User() user: Claims): Promise<void> {
    await this.personalService.update(newPersonal, user.id);
  }
}
