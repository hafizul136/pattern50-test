import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SendEmailDto } from './dto/create-email.dto';


@Injectable()
export class EmailService {
  constructor(@Inject('EMAIL_SERVICE_RMQ')
  private readonly emailServiceRMQClient: ClientRMQ) { }
  async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    await lastValueFrom(this.emailServiceRMQClient.emit('email.send', sendEmailDto));
  }
}
