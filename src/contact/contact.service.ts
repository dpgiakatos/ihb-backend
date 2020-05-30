import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contact } from "./contact.entity";
import { Repository } from "typeorm";
import { CreateContactBindings } from "./contact.bindings";

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>
    ) {}

    async postContact(contact: CreateContactBindings) {
        const newContact = this.contactRepository.create();
        newContact.email = contact.email;
        newContact.subject = contact.subject;
        newContact.message = contact.message;
        return await this.contactRepository.save(newContact);
    }
}