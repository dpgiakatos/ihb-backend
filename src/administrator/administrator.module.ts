import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AdministratorService } from './administrator.service';
import { UsersTabService } from './users-tab/users-tab.service';
import { AdministratorController } from './administrator.controller';
import { UsersTabController } from './users-tab/users-tab.controller';

@Module({
    imports: [UsersModule],
    providers: [AdministratorService, UsersTabService],
    controllers: [AdministratorController, UsersTabController]
})
export class AdministratorModule {}
