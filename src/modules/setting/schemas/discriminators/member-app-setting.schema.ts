import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { SettingType } from '@/constants'
import { memberAppDefault } from '../default/member-app.default'

export type MemberAppSettingDocument = Document & MemberAppSetting

@Schema({ versionKey: false })
export class MemberAppSetting {
	type: SettingType.MEMBER_APP

	@Prop({ type: String })
	appName: string

	@Prop({
		type: {
			pointName: { type: String },
			startMilestone: { type: Number, min: 1 },
			pointPerUnit: { type: Number, min: 1 },
			unitStep: { type: Number, min: 1 },
		},
		default: memberAppDefault.point,
		_id: false,
	})
	point: {
		pointName: string
		startMilestone: number
		pointPerUnit: number
		unitStep: number
	}

	@Prop({
		type: {
			image: { type: String },
			content: { type: String, required: true },
		},
		default: memberAppDefault.greeting,
		_id: false,
	})
	greeting: {
		image: string
		content: string
	}

	@Prop({
		type: {
			product: String,
			store: String,
			category: String,
			coupon: String,
			couponNotification: String,
		},
		default: memberAppDefault.defaultImages,
		_id: false,
	})
	defaultImages: {
		product: string
		store: string
		category: string
		coupon: string
		couponNotification: string
	}

	@Prop({
		type: {
			defaultDisplay: {
				type: {
					icon: String,
					color: String,
					background: String,
				},
				_id: false,
			},
		},
		_id: false,
		default: memberAppDefault.memberRank,
	})
	memberRank: {
		defaultDisplay: {
			icon: string
			color: string
			background: string
		}
	}
}

export const MemberAppSettingSchema =
	SchemaFactory.createForClass(MemberAppSetting)
