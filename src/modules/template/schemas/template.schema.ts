import { TemplateType } from '@/constants'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TemplateDocument = Document & Template

@Schema({ versionKey: false, discriminatorKey: 'type' })
export class Template {
	@Prop({
		type: String,
		enum: Object.values(TemplateType),
		index: true,
		required: true,
		unique: true,
	})
	type: TemplateType
}

export const TemplateSchema = SchemaFactory.createForClass(Template)
