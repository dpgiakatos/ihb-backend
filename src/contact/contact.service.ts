import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contact } from "./contact.entity";
import { Repository } from "typeorm";
import { ContactBindings } from "./contact.bindings";
import { GetPaginationQuery } from "../helpers/pagination-query";

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>
    ) {}

    async postContact(contact: ContactBindings) {
        const newContact = this.contactRepository.create();
        newContact.email = contact.email;
        newContact.subject = contact.subject;
        newContact.message = contact.message;
        return await this.contactRepository.save(newContact);
    }


    async findAllContact(page: number): Promise<any> {
        return await this.contactRepository.findAndCount({
            skip: (page * 10) - 10,
            take: 10,
            order: { id: 'ASC' }
        });
    }

    async findContact(id: number): Promise<any> {
        return await this.contactRepository.findOne({ where: { id: id }});
    }

    async deleteContact(id: number) {
        const req = await this.contactRepository.findOne({ where: { id: id }})
            const extra = this.contactRepository.create();
            extra.id = id;
            await this.contactRepository.delete(extra);   
    }
}