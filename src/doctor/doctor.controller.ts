import { Controller, Get, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { User } from '../auth/decorators/user.decorator';
import { Claims } from '../auth/models/claims.interface';
import { Auth } from '../auth/decorators/auth.decorator';

@Auth
@Controller('doctor')
export class DoctorController {

    constructor(private doctorService: DoctorService) {}

    @Get('find')
    async find(@Query('search') search: string, @Query('country') country: string | null, @User() claims: Claims) {
        return await this.doctorService.find(search, country, claims);
    }
}
