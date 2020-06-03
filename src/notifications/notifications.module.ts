import { forwardRef, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
    imports: [forwardRef(() => DoctorModule)],
    controllers: [NotificationsController],
    providers: [NotificationsService]
})
export class NotificationsModule { }

