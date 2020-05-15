import { Module } from '@nestjs/common';
import { AllergicService } from './allergic.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Allergic} from "./allergic.entity";
import { User } from '../users/user.entity';
import { AllergicController } from './allergic.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Allergic, User])],
  providers: [AllergicService],
  controllers: [AllergicController],
  exports: [AllergicService, TypeOrmModule]
})
export class AllergicModule {}