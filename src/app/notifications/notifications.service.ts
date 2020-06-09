import { Claims } from '../../auth/models/claims.interface';
import { Injectable } from '@nestjs/common';
import { DoctorService } from '../doctor/doctor.service';
import { AlertLog } from '../doctor/doctor.bindings';

@Injectable()
export class NotificationsService {
    constructor(private doctorService: DoctorService) { }

    async getUserLogs(claims: Claims): Promise<AlertLog[]> {
        return await this.doctorService.getUserAlerts(claims);
    }
}
