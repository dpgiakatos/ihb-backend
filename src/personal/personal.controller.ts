import {Controller, Post, Body, Delete, Get, Param, Put, Query, Patch} from '@nestjs/common';
import {PersonalService} from "./personal.service";
import {InjectRepository} from '@nestjs/typeorm';
import {Personal} from './personal.entity';
import {Repository} from 'typeorm';

@Controller('dashboard')
export class PersonalController {
  constructor(
    private personalService: PersonalService,
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>
  ) {}

  @Get('personal')
  async getPersonal(@Query('user') id: number): Promise<any> {
    return await this.personalRepository.findOne({
      where: {
        id: id
      }
    });  
  }

  @Post('personal')
  async postPersonal(@Body() newPersonal){
    await this.personalService.create(newPersonal);
  }

  @Delete('personal')
  async remove(@Query('user') id: number) {
    await this.personalRepository.delete(id);
  }

  @Put('personal')
  async putPersonal(@Body() newPersonal){
    await this.personalService.create(newPersonal);
  }

  @Patch('personal')
  async patchPersonal(@Body() operation, @Query('user') id: number) {
    const op = operation.op;
    const path = operation.path;
    const val = operation.value;
    if (op == "remove"){
      console.log("remove");
    }
    else if (op == "replace"){
      console.log("replace");
    }
    else if (op == "add"){
      console.log("add");
    }
    console.log(op + " " + path + " " + val);
  }


}
