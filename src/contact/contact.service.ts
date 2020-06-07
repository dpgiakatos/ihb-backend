import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { Repository } from 'typeorm';
import { ContactBindings } from './contact.bindings';
import { GetPaginationQuery } from '../helpers/pagination-query';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>
    ) {}

    async postContact(contact: ContactBindings) {
        const newContact = this.contactRepository.create({
            ...contact
        });
        return await this.contactRepository.save(newContact);
    }

    async findAllContact(page: number) {
        return await this.contactRepository.findAndCount({
            ...GetPaginationQuery(page, 10)
        });
    }

    async findContact(id: number) {
        const contact = await this.contactRepository.findOne({ where: { id: id } });
        if(!contact) {
            throw new NotFoundException();
        }
        return contact;
    }

    async deleteContact(id: number) {
        const existing = await this.contactRepository.findOne(id);
        if (!existing) {
            throw new NotFoundException();
        }
        await this.contactRepository.remove(existing);
    }
}