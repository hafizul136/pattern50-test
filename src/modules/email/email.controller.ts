import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailDto } from './dto/create-email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<string> {

    await this.emailService.sendEmail(sendEmailDto);
    return 'Email sent successfully'
  }


}
