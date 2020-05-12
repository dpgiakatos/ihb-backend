import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PersonalModule } from './personal/personal.module';
import { isUnique } from './helpers/unique.decorator';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    PersonalModule
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
