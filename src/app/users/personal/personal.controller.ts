import { Controller, Body, Get, Put, Param, ForbiddenException } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { Personal } from './personal.entity';
import { User } from '../../../auth/decorators/user.decorator';
import { Claims, Role } from '../../../auth/models/claims.interface';
import { Auth } from '../../../auth/decorators/auth.decorator';
import { UpdatePersonalBindings } from './personal.bindings';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { DoctorService } from '../../doctor/doctor.service';

@Auth
@Controller('user')
export class PersonalController {
  constructor(
      private personalService: PersonalService,
      private doctorService: DoctorService
  ) { }

  @Get('personal-information')
  async getPersonal(@User() user: Claims): Promise<Personal> {
    return await this.personalService.findByUser(user.id);
  }

  @Put('personal-information')
  async putPersonal(@Body() personalInformation: UpdatePersonalBindings, @User() user: Claims): Promise<void> {
    await this.personalService.update(personalInformation, user.id);
  }

  @Get(':userId/personal-information')
  @Roles(Role.Doctor)
  async getSpecificPersonal(@Param('userId') userId: string, @User() claims:Claims): Promise<Personal> {
    if (!(await this.doctorService.hasAccess(userId, claims))) {
      throw new ForbiddenException();
    }
    return await this.personalService.findByUser(userId);
  }
}
