import { Claims } from '../auth/models/claims.interface';
import { Injectable } from '@nestjs/common';
import { DoctorService } from '../doctor/doctor.service';

@Injectable()
export class NotificationsService {
    constructor(private doctorService: DoctorService) { }

    async getUserLogs(claims: Claims) {
        return await this.doctorService.getUserAlerts(claims);
    }
}
