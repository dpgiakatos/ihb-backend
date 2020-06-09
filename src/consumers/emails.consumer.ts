import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Processor('emails')
export class EmailsConsumer {

    constructor(private mailerService: MailerService) { }

    @Process()
    async sendEmail(job: Job<ISendMailOptions>) {
        await this.mailerService.sendMail(job.data);
    }
}