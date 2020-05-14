import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { isUnique } from './helpers/unique.decorator';
import { Hospital } from './hospital/hospital.entity';
import { HospitalModule } from './hospital/hospital.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    HospitalModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    isUnique
  ],
  exports: [
    UsersModule
  ]
})
export class AppModule {}
