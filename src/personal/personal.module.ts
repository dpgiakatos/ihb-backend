import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Personal} from "./personal.entity";
import { PersonalController } from './personal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Personal])],
  providers: [PersonalService],
  controllers: [PersonalController],
  exports: [PersonalService, TypeOrmModule]
})
export class PersonalModule {}
