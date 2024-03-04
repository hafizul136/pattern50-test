import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IAwsSesSendEmail } from '@common/helpers/aws.service';


@Injectable()
export class EmailService {
  constructor(@Inject('EMAIL_SERVICE_RMQ')
  private readonly emailServiceRMQClient: ClientRMQ) { }
  async sendEmail(iAwsSesSendEmail: IAwsSesSendEmail): Promise<void> {
    await lastValueFrom(this.emailServiceRMQClient.emit('email.send', iAwsSesSendEmail));
  }
}
