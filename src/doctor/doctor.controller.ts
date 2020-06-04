import { Controller, Get, Param, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { User } from '../auth/decorators/user.decorator';
import { Claims, Role } from '../auth/models/claims.interface';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Auth
@Controller('doctor')
export class DoctorController {

    constructor(private doctorService: DoctorService) {}

    @Get('find')
    @Roles(Role.Doctor)
    async find(
        @Query('search') search: string,
        @Query('country') country: string | undefined,
        @Query('page') page = 1,
        @User() claims: Claims
    ) {
        return await this.doctorService.find(search, country, claims, page);
    }

    @Get(':userId/access')
    @Roles(Role.Doctor)
    async access(@Param('userId') id: string, @User() claims: Claims) {
        await this.doctorService.accessToUser(id, claims);
    }

    @Get(':userId/has-access')
    @Roles(Role.Doctor)
    async has(@Param('userId') id: string, @User() claims: Claims) {
        return await this.doctorService.hasAccess(id, claims);
    }
}
