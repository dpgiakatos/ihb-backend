import { Controller, Post, Body, Delete, Get, Put, Param, ParseIntPipe } from '@nestjs/common';
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

  @Get(':page')
  async getAllergic(@Param('page', ParseIntPipe) page: number,@User() user: Claims): Promise<Allergic[]> {
    return await this.allergicService.findAllAllergic(page, user);
  }

  @Get('count_allergic/count')
    async countExtraVaccinations(@User() user: Claims) {
        return await this.allergicService.countAllergic(user.id);
  }

  @Post()
  async postAllergic(@Body() allergic: Allergic, @User() user: Claims): Promise<any> {
    return await this.allergicService.create(allergic, user);
  }


  @Delete(':id')
    async deleteAllergic(@Param('id', ParseIntPipe) id: number, @User() claims: Claims) {
        await this.allergicService.deleteAllergic(id, claims);
    }

    @Put(':id')
    async editAllergic(
        @Param('id', ParseIntPipe) id: number,
        @Body() allergic: Allergic,
        @User() claims: Claims
    ) {
        return await this.allergicService.editAllergic(id, allergic, claims);
    }
}