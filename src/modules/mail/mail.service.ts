import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { MailInfoDto } from './dto/mail-info.dto'
import { TemplateService } from '../template/services/template.service'

@Injectable()
export class MailService {
	constructor(
		private mailerService: MailerService,
		private templateService: TemplateService
	) {}

	async sendMail({ recipient, content }: MailInfoDto) {
		try {
			const info = await this.mailerService.sendMail({
				to: recipient,
				subject: this.templateService.generateHtml({
					template: content.subject,
					data: content.data,
				}),
				html: this.templateService.generateHtml({
					template: content.body,
					data: content.data,
				}),
			})
			return !!info?.accepted.includes(recipient)
		} catch (err) {
			return err
		}
	}
}
