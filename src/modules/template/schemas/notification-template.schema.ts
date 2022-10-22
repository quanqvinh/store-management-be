import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { TemplateType } from '@/constants/index'
import { Template, TemplateScript, TemplateScriptDefine } from './template.schema'

export type NotificationTemplateDocument = Document & NotificationTemplate

export type NotificationTemplateScript = {
	title: TemplateScript
	content: TemplateScript
}

const NotificationTemplateScriptDefine = {
	title: TemplateScriptDefine,
	content: TemplateScriptDefine,
}

@Schema({ versionKey: false })
export class NotificationTemplate extends Template {
	type: TemplateType.NOTIFICATION

	@Prop({ type: NotificationTemplateScriptDefine })
	order: NotificationTemplateScript
}

export const NotificationTemplateSchema = SchemaFactory.createForClass(NotificationTemplate)
