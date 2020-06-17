import { MailerOptions } from '@nestjs-modules/mailer';

export default () => {
    const signingSecret = process.env.SIGNING_SECRET;
    const databasePassword = process.env.DATABASE_PASSWORD;
    const gmailUsername = process.env.GMAIL_USERNAME;
    const gmailPassword = process.env.GMAIL_PASSWORD;
    if (!signingSecret) {
        throw new Error('No SIGNING_SECRET value found in environment');
    }
    if (!databasePassword) {
        throw new Error('No DATABASE_PASSWORD value found in environment');
    }
    if (!gmailUsername) {
        throw new Error('No GMAIL_USERNAME value found in environment');
    }
    if (!gmailPassword) {
        throw new Error('No GMAIL_PASSWORD value found in environment');
    }

    return {
        apiUrl: 'https://internationalhealthbooklet.tech/api',
        frontendUrl: 'https://internationalhealthbooklet.tech/',
        databasePassword,
        signingSecret,
        redisOptions: {
            host: 'localhost',
            port: 6379
        },
        mailerOptions: {
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use TLS
                auth: {
                    user: gmailUsername,
                    pass: gmailPassword
                }
            },
        } as MailerOptions
    };
}

