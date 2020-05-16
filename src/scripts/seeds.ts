import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/models/claims.interface';
import { AuthController } from '../auth/auth.controller';
import { PersonalService } from '../personal/personal.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.init();

    const userService = app.get(UsersService);
    const authService = app.get(AuthService);
    const personalService = app.get(PersonalService);
    
    const user = await userService.create('user@user.com', 'test');
    await authService.setUserRole(user, Role.User);
    await personalService.create({ firstName: 'First', lastName: 'Last' }, user.id);
    const doctor = await userService.create('doctor@doctor.com', 'test');
    await authService.setUserRole(doctor, Role.Doctor);

    await app.close();
}
bootstrap();