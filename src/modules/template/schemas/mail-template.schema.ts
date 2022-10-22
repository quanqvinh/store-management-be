import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { TemplateType } from '@/constants/index'
import { Template, TemplateScript, TemplateScriptDefine } from './template.schema'

export type MailTemplateDocument = Document & MailTemplate

export type MailTemplateScript = {
	title: TemplateScript
	body: TemplateScript
}

const MailTemplateScriptDefine = {
	title: TemplateScriptDefine,
	body: TemplateScriptDefine,
}

@Schema({ versionKey: false })
export class MailTemplate extends Template {
	type: TemplateType.MAIL

	@Prop({ type: MailTemplateScriptDefine })
	verifyAccount: MailTemplateScript

	@Prop({ type: MailTemplateScriptDefine })
	resetPassword: MailTemplateScript
}

export const MailTemplateSchema = SchemaFactory.createForClass(MailTemplate)
