import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Contact} from "./contact.entity";
import { ContactController } from './contact.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  providers: [ContactService],
  controllers: [ContactController],
  exports: [ContactService, TypeOrmModule]
})
export class ContactModule {}