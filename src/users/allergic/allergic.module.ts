import { Module } from '@nestjs/common';
import { AllergicService } from './allergic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allergic } from './allergic.entity';
import { AllergicController } from './allergic.controller';
import { UsersModule } from '../users.module';


@Module({
  imports: [TypeOrmModule.forFeature([Allergic]), UsersModule],
  providers: [AllergicService],
  controllers: [AllergicController],
  exports: [AllergicService, TypeOrmModule]
})
export class AllergicModule {}