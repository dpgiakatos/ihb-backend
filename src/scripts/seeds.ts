import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { PersonalService } from '../users/personal/personal.service';
import { Vaccine } from '../users/vaccinations/vaccine.entity';


import { Role } from '../auth/models/claims.interface';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    await app.init();

    const userService = app.get(UsersService);
    const authService = app.get(AuthService);
    const personalService = app.get(PersonalService);
    const vaccinesRepo = app.get<string, Repository<Vaccine>>(getRepositoryToken(Vaccine))
    
    const user = await userService.create('user@user.com', 'test');
    await authService.setUserRole(user, Role.User);
    await personalService.create({ firstName: 'First', lastName: 'Last' }, user.id);
    const doctor = await userService.create('doctor@doctor.com', 'test');
    await authService.setUserRole(doctor, Role.Doctor);

    await vaccinesRepo.insert([
        vaccinesRepo.create({ name: 'Tuberculosis' }),
        vaccinesRepo.create({ name: 'Rotavirus infection' }),
        vaccinesRepo.create({ name: 'Diphtheria' }),
        vaccinesRepo.create({ name: 'Tetanus' }),
        vaccinesRepo.create({ name: 'Pertussis' }),
        vaccinesRepo.create({ name: 'Poliomyelitis' }),
        vaccinesRepo.create({ name: 'Haemophilus influenzae type b infection' }),
        vaccinesRepo.create({ name: 'Hepatitis B' }),
        vaccinesRepo.create({ name: 'Pneumococcal disease' }),
        vaccinesRepo.create({ name: 'Meningococcal disease' }),
        vaccinesRepo.create({ name: 'Measles' }),
        vaccinesRepo.create({ name: 'Mumps' }),
        vaccinesRepo.create({ name: 'Rubella' }),
        vaccinesRepo.create({ name: 'Varicella' }),
        vaccinesRepo.create({ name: 'Human papillomavirus infection' }),
        vaccinesRepo.create({ name: 'Influenza' }),
        vaccinesRepo.create({ name: 'Herpes zoster' }),
        vaccinesRepo.create({ name: 'Hepatitis A' })
    ]);

    await app.close();
}
bootstrap().catch(err => {
    console.error(err);
    process.exit(1);
});