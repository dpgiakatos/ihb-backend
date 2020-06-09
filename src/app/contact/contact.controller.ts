import { Auth, SkipAuth } from '../../auth/decorators/auth.decorator';
import { Controller, Post, Body, Get, ParseIntPipe, Param, Delete } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactBindings } from './contact.bindings';
import { Contact } from './contact.entity';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/claims.interface';

@Auth
@Controller('contact')
export class ContactController {
    constructor(
        private contactService: ContactService
    ) {}

    @Get(':page')
    @Roles(Role.Administrator)
    async getContactsList(@Param('page', ParseIntPipe) page: number): Promise<{ contacts: Contact[]; count: number; }> {
        const [contacts, count] = await this.contactService.findAllContact(page);
        return { contacts, count };
    }

    @Get('message/:id')
    @Roles(Role.Administrator)
    async getContact(@Param('id', ParseIntPipe) id: number): Promise<Contact> {
        return await this.contactService.findContact(id);
    }

    @SkipAuth
    @Post()
    async postContact(@Body() contact: ContactBindings): Promise<Contact> {
        return await this.contactService.postContact(contact);
    }

    @Delete(':id')
    @Roles(Role.Administrator)
    async deleteContact(@Param('id', ParseIntPipe) id: number) {
        await this.contactService.deleteContact(id);
    }
}