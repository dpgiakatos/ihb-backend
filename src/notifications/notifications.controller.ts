import { Auth } from '../auth/decorators/auth.decorator';
import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { User } from '../auth/decorators/user.decorator';
import { Claims } from '../auth/models/claims.interface';
import { AlertLog } from '../doctor/doctor.bindings';

@Auth
@Controller('notifications')
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }

    @Get('doctors-logs')
    async getUsersLogs(@User() claims: Claims): Promise<AlertLog[]> {
        return await this.notificationsService.getUserLogs(claims);
    }
}
