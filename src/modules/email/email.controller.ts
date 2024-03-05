import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { IAwsSesSendEmail } from '@common/helpers/aws.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('send')
  async sendEmail(@Body() iAwsSesSendEmail: IAwsSesSendEmail): Promise<string> {
    await this.emailService.sendEmail(iAwsSesSendEmail);
    return 'Email sent successfully'
  }


}
