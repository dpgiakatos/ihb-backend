import { Auth } from "../auth/decorators/auth.decorator";
import { Controller, Post, Body, Get, Query, ParseIntPipe, Param, Delete } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { ContactBindings } from "./contact.bindings";
import { Contact } from "./contact.entity";

@Auth
@Controller('contact')
export class ContactController {
    constructor(
        private contactService: ContactService
    ) {}

    @Get(':page')
    async getContactsList(@Param('page', ParseIntPipe) page: number): Promise<{ contacts: Contact[]; count: number; }> {
        const [contacts, count] = await this.contactService.findAllContact(page);
        return {contacts, count};
    }

    @Get('new/:id')
    async getContact(@Param('id', ParseIntPipe) id: number): Promise<{ contacts: Contact; }> {
        return await this.contactService.findContact(id);
    }

    @Post()
    async postContact(@Body() contact: ContactBindings): Promise<any> {
        return await this.contactService.postContact(contact);
    }

    @Delete(':id')
    async deleteContact(@Param('id', ParseIntPipe) id: number) {
        console.log("Hello");
        await this.contactService.deleteContact(id);
    }
}