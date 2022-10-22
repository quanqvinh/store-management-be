import { TemplateType } from '@/constants'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

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

export type TemplateScript = {
	variables: Array<string>
	script: string
}

export const TemplateScriptDefine = {
	variables: [{ type: String }],
	script: { type: String },
}

export const TemplateSchema = SchemaFactory.createForClass(Template)
