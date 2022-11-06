import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId, Types } from 'mongoose'
import { SettingType } from '@/constants'

export type MemberAppSettingDocument = Document & MemberAppSetting

@Schema({ versionKey: false })
export class MemberAppSetting {
	type: SettingType.MEMBER_APP

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
			content: { type: String, required: true },
		},
	})
	greeting: {
		image: string
		content: string
	}

	@Prop({
		type: {
			product: Types.ObjectId,
			store: Types.ObjectId,
		},
	})
	defaultImages: {
		product: ObjectId
		store: ObjectId
	}
}

export const MemberAppSettingSchema =
	SchemaFactory.createForClass(MemberAppSetting)
