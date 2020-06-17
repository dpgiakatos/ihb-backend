import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import { AuthModule } from '../../auth/auth.module';

@Module({
    imports: [UsersModule, AuthModule],
    providers: [AdministratorService],
    controllers: [AdministratorController]
})
export class AdministratorModule {}
