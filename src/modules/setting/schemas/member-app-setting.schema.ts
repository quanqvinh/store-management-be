import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId, Types } from 'mongoose'
import {
	TemplateScript,
	TemplateScriptDefine,
} from '@/modules/template/schemas/template.schema'

export type MemberAppSettingDocument = Document & MemberAppSetting

@Schema({ versionKey: false })
export class MemberAppSetting {
	type: string

	@Prop({ type: String })
	appName: string

	@Prop({
		type: {
			pointName: { type: String },
			pointPerUnit: { type: Number, min: 1 },
			unitCost: { type: Number, min: 1 },
		},
	})
	point: {
		pointName: string
		pointPerUnit: number
		unitCost: number
	}

	@Prop({
		type: {
			image: { type: String },
			content: { type: TemplateScriptDefine, required: true },
		},
	})
	greeting: {
		image: string
		content: TemplateScript
	}

	@Prop({ type: Types.ObjectId })
	defaultProductImage: ObjectId

	@Prop({ type: Types.ObjectId })
	defaultStoreImage: ObjectId
}

export const MemberAppSettingSchema =
	SchemaFactory.createForClass(MemberAppSetting)
