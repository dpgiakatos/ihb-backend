import { Module, ClassSerializerInterceptor, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PersonalModule } from './personal/personal.module';
import { isUnique } from './helpers/unique.decorator';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {VaccinationsModule} from "./vaccinations/vaccinations.module";
import { DoctorController } from './doctor/doctor.controller';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    PersonalModule,
    HttpModule,
    VaccinationsModule,
    DoctorModule
  ],
  controllers: [AppController, DoctorController],
  providers: [
    AppService,
    isUnique,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
  exports: [
    UsersModule
  ]
})
export class AppModule {}
