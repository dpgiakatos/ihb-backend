import { MailerOptions } from '@nestjs-modules/mailer';

export default {
    apiUrl: 'http://localhost:3000',
    frontendUrl: 'http://localhost:4200',
    signingSecret: 'secret',
    databasePassword: process.env.DATABASE_PASSWORD || 'root',
    mailerOptions: {
        transport: { jsonTransport: true },
        preview: true,
    } as MailerOptions
}