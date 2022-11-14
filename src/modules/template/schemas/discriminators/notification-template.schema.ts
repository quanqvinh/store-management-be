import { TemplateType } from '@/constants'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { TemplateScript } from '@/types'

export type NotificationTemplateDocument = Document & NotificationTemplate

@Schema({ versionKey: false })
export class NotificationTemplate {
	type: TemplateType.NOTIFICATION

	@Prop({
		type: { variables: [String], title: String, content: String },
		default: { variable: [], title: '', content: '' },
	})
	order: TemplateScript<'title' | 'content'>
}

export const NotificationTemplateSchema =
	SchemaFactory.createForClass(NotificationTemplate)
