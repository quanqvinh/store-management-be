import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { TemplateType } from '@/constants/index'
import { mailTemplateDefault } from './default/mail-template.default'

export type MailTemplateDocument = Document & MailTemplate

export type MailTemplateScript = {
	variables: Array<string>
	subject: string
	body: string
}

const MailTemplateScriptDefine = {
	variables: { type: [String] },
	subject: { type: String },
	body: { type: String },
}

@Schema({ versionKey: false })
export class MailTemplate {
	type: TemplateType.MAIL

	@Prop({
		type: MailTemplateScriptDefine,
		default: mailTemplateDefault.otp,
		_id: false,
	})
	otp: MailTemplateScript
}

export const MailTemplateSchema = SchemaFactory.createForClass(MailTemplate)
