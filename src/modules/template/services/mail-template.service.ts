import { DatabaseConnectionName, TemplateType } from '@/constants'
import { GeneralService } from '@/modules/setting/services/general.service'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MailTemplateDocument } from '../schemas/mail-template.schema'
import { TemplateService } from './template.service'

@Injectable()
export class MailTemplateService {
	constructor(
		@InjectModel(TemplateType.MAIL, DatabaseConnectionName.DATA)
		private readonly mailTemplateModel: Model<MailTemplateDocument>,
		private generalSettingService: GeneralService,
		private templateService: TemplateService
	) {
		this.templateService
			.initDocument(TemplateType.MAIL)
			.then(document => {
				if (document)
					Logger.debug(
						'Init mail template document successful',
						'TemplateCollection'
					)
				else
					Logger.debug('Mail template document existed', 'TemplateCollection')
			})
			.catch(err =>
				Logger.error('Init Mail template error\n' + err, 'TemplateCollection')
			)
	}

	async getOtpMailData() {
		const appVariables = await this.generalSettingService.getVariables()
		const otpTemplate = (
			await this.mailTemplateModel
				.findOne({
					type: TemplateType.MAIL,
				})
				.select('otp')
				.lean()
				.exec()
		)?.otp

		const templateData = otpTemplate.variables.reduce((res, cur) => {
			Object.assign(res, {
				[cur]: Object.keys(appVariables).includes(cur)
					? appVariables[cur]
					: cur,
			})
			return res
		}, {})
		return {
			subject: otpTemplate.subject,
			body: otpTemplate.body,
			data: templateData,
		}
	}
}
