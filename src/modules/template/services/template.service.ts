import { DatabaseConnectionName, TemplateType } from '@/constants'
import { TemplateData, TemplateWithData } from '@/types'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { compile } from 'handlebars'
import { Model } from 'mongoose'
import { MailTemplateDocument } from '../schemas/discriminators/mail-template.schema'
import { Template, TemplateDocument } from '../schemas/template.schema'

@Injectable()
export class TemplateService {
	constructor(
		@InjectModel(Template.name, DatabaseConnectionName.DATA)
		private readonly templateModel: Model<TemplateDocument>,
		@InjectModel(TemplateType.MAIL, DatabaseConnectionName.DATA)
		private readonly mailTemplateModel: Model<MailTemplateDocument>
	) {}

	async initDocument(type: TemplateType) {
		const checkExist = await this.templateModel.count({ type }).lean().exec()
		if (checkExist > 0) {
			return
		}
		if (type === TemplateType.MAIL) {
			return this.mailTemplateModel.create({ type: TemplateType.MAIL })
		}
	}

	generateHtml({
		template,
		data,
	}: {
		template: string
		data: TemplateData
	}): string
	generateHtml({ template, data }: TemplateWithData) {
		const hbsTemplate = compile(template)
		return hbsTemplate(data)
	}
}
