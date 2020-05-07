import {HttpModule, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import {VaccinationsModule} from "./vaccinations/vaccinations.module";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    HttpModule,
    VaccinationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
