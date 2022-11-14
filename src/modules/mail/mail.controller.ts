import { Controller } from '@nestjs/common'
import { MailService } from './mail.service'

@Controller('mail')
export class MailController {
	constructor(private mailService: MailService) {}

	// @Get('test')
	// @SkipThrottle()
	// async testSendMail() {
	// 	return await this.mailService.example()
	// }
}
