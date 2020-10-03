import { MailerOptions } from '@nestjs-modules/mailer';

export default {
    apiUrl: 'http://localhost:3000',
    frontendUrl: 'http://localhost:4200',
    signingSecret: 'secret',
    databasePassword: process.env.DATABASE_PASSWORD || 'root',
    databaseUsername: process.env.DATABASE_USERNAME || 'root',
    mailerOptions: {
        transport: { jsonTransport: true },
        preview: true,
    } as MailerOptions
}