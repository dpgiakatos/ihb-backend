import {Controller, Post, Body, Delete, Get, Param, Put, Query, Patch} from '@nestjs/common';
import {PersonalService} from "./personal.service";
import {InjectRepository} from '@nestjs/typeorm';
import {Personal} from './personal.entity';
import {Repository} from 'typeorm';
import { User } from 'src/auth/decorators/user.decorator';
import { Claims } from 'src/auth/models/claims.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth
@Controller('dashboard')
export class PersonalController {
  constructor(
    private personalService: PersonalService,
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>
  ) {}

  @Get('personal')
  async getPersonal(@User() user: Claims): Promise<any> {
    return await this.personalRepository.findOne({
      where: {
        user: user.id
      }
    });  
  }

  @Post('personal')
  async postPersonal(@Body() newPersonal: any, @User() user: Claims){
    console.log("Hello\n\n\n")
    await this.personalService.create(newPersonal, user);
  }

  @Delete('personal')
  async remove(@User() user: Claims) {
    await this.personalRepository.delete({user: user.id});
  }

  @Put('personal')
  async putPersonal(@Body() newPersonal: any, @User() user: Claims){
    await this.personalService.update(newPersonal, user);
  }
}
