import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AllergicService } from './allergic.service';
import { Allergic } from './allergic.entity';
import { User } from '../../auth/decorators/user.decorator';
import { Claims, Role } from '../../auth/models/claims.interface';
import { Auth } from '../../auth/decorators/auth.decorator';
import { UsersService } from '../users.service';
import { AllergicBindings } from './allergic.bindings';
import { Roles } from '../../auth/decorators/roles.decorator';

@Auth
@Controller('user')
export class AllergicController {
  constructor(
    private allergicService: AllergicService,
    private userService: UsersService
  ) {}

  @Get('allergic')
  async getAllergic(
    @User() user: Claims,
    @Query('page') page = 1
  ): Promise<{ allergics: Allergic[]; count: number; }>{
    const [allergics, count] = await this.allergicService.findAllAllergic(user.id, page);
    return { allergics, count };
  }

  @Get(':userId/allergic')
  @Roles(Role.Doctor)
    async getSomeAllergic(
      @Param('userId') id: string,
      @Query('page') page: 1
    ): Promise<{ allergics:Allergic[]; count: number; }> {
      await this.userService.assertExists(id);
      const [allergics, count] = await this.allergicService.findAllAllergic(id, page);
      return { allergics, count };
  }

  @Post(':userId/allergic')
  @Roles(Role.Doctor)
  async postAllergic(
    @Param('userId') id: string,
    @Body() allergic: AllergicBindings
  ): Promise<Allergic> {
    await this.userService.assertExists(id);
    return await this.allergicService.addAllergy(allergic, id);
  }


  @Delete('allergic/:allergicId')
  @Roles(Role.Doctor)
    async deleteAllergic(
      @Param('allergicId') allergicId: string,
  ): Promise<void> {
        await this.allergicService.deleteAllergic(allergicId);
    }

    @Put('allergic/:allergicId')
    @Roles(Role.Doctor)
    async editAllergic(
        @Param('allergicId') allergicId: string,
        @Body() allergic: Allergic,
    ) {
        return await this.allergicService.editAllergic(allergicId, allergic);
    }
}
