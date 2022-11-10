import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId, Types } from 'mongoose'
import { SettingType } from '@/constants'
import { memberAppDefault } from './default/member-app.default'

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
			image: { type: Types.ObjectId },
			content: { type: String, required: true },
		},
		default: memberAppDefault.greeting,
		_id: false,
	})
	greeting: {
		image: Types.ObjectId
		content: string
	}

	@Prop({
		type: {
			product: Types.ObjectId,
			store: Types.ObjectId,
			coupon: Types.ObjectId,
			couponNotification: Types.ObjectId,
		},
	})
	defaultImages: {
		product: Types.ObjectId
		store: Types.ObjectId
		coupon: Types.ObjectId
		couponNotification: Types.ObjectId
	}

	@Prop({
		type: {
			defaultDisplay: {
				type: {
					icon: Types.ObjectId,
					color: String,
					background: Types.ObjectId,
				},
				_id: false,
			},
		},
		_id: false,
		default: memberAppDefault.memberRank,
	})
	memberRank: {
		defaultDisplay: {
			icon: Types.ObjectId
			color: string
			background: Types.ObjectId
		}
	}
}

export const MemberAppSettingSchema =
	SchemaFactory.createForClass(MemberAppSetting)
