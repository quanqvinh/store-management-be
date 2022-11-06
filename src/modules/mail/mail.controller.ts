import { Controller } from '@nestjs/common'
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator'
import { MailService } from './mail.service'

@Controller('mail')
export class MailController {
	constructor(private mailService: MailService) {}

	// @Get('test')
	// async testSendMail() {
	// 	return await this.mailService.example()
	// }
}
