import { Controller, Get, Param, Query, UnprocessableEntityException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { User } from '../../auth/decorators/user.decorator';
import { Claims, Role } from '../../auth/models/claims.interface';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Personal } from '../users/personal/personal.entity';

@Auth
@Controller('doctor')
export class DoctorController {

    constructor(private doctorService: DoctorService) {}

    @Get('find')
    @Roles(Role.Doctor)
    async find(
        @Query('page') page = 1,
        @User() claims: Claims,
        @Query('search') search?: string,
        @Query('country') country?: string,
    ): Promise<{ users: Personal[], count: number }> {
        if (!search) {
            throw new UnprocessableEntityException('Search parameter is required');
        }

        const [users, count] = await this.doctorService.findPatients(search, country, claims, page);
        return { users, count };
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
