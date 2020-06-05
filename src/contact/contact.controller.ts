import { Auth } from "../auth/decorators/auth.decorator";
import { Controller, Post, Body } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Contact } from "./contact.entity";
import { Repository } from "typeorm";
import { CreateContactBindings } from "./contact.bindings";

@Auth
@Controller('contact')
export class ContactController {
    constructor(
        private contactService: ContactService
    ) {}

    @Post()
    async postContact(@Body() contact: CreateContactBindings): Promise<any> {
        console.log("Hello");
        console.log(contact.message);
        return await this.contactService.postContact(contact);
    }
}