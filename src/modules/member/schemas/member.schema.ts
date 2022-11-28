import {
	AppliedCoupon,
	AppliedCouponSchema,
} from '@/modules/applied-coupon/schemas/applied-coupon.schema'
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId, Types } from 'mongoose'
import { Gender } from '@/constants'
import {
	MemberInfo,
	MemberInfoSchema,
	MemberInfoVirtual,
} from './member-info.schema'
import {
	MemberHistoryDay,
	MemberHistoryDaySchema,
} from './member-history-day.schema'
import {
	Notification,
	NotificationSchema,
} from '@/modules/notification/schemas/notification.schema'
import mongooseDelete from 'mongoose-delete'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { OmitType } from '@nestjs/swagger'

export type MemberVirtual = {
	fullName: string
	variable: Record<string, string | number | boolean>
	memberInfo: MemberInfoVirtual
}

export type MemberDocument = Member & Document & MemberVirtual

@Schema({ versionKey: false, timestamps: { createdAt: 'joinedAt' } })
export class Member {
	_id: ObjectId

	@Prop({ type: String, required: true, unique: true })
	email: string

	@Prop({ type: String, required: true, unique: true })
	mobile: string

	@Prop({
		type: {
			validTokenTime: { type: Number, default: Date.now() },
		},
		default: {},
		_id: false,
		required: true,
	})
	auth: {
		validTokenTime: number
	}

	@Prop({ type: String })
	avatar: string

	@Prop({ type: String, required: true })
	firstName: string

	@Prop({ type: String, required: true })
	lastName: string

	@Prop({ type: String, enum: Object.values(Gender), required: true })
	gender: Gender

	@Prop({ type: Date, required: true })
	dob: Date

	@Prop({ type: Date })
	joinedAt: Date

	@Prop({ type: MemberInfoSchema, default: {}, required: true })
	memberInfo: MemberInfo

	@Prop({
		type: {
			product: [{ type: Types.ObjectId, ref: 'Product' }],
			store: [{ type: Types.ObjectId, ref: 'Store' }],
		},
		_id: false,
		default: { product: [], store: [] },
	})
	favorite: {
		product: Array<ObjectId>
		store: Array<ObjectId>
	}

	@Prop({ type: [AppliedCouponSchema], default: [] })
	coupons: Array<AppliedCoupon>

	@Prop({ type: MemberHistoryDaySchema })
	specialDays: MemberHistoryDay

	@Prop([{ type: NotificationSchema }])
	notifications: Array<Notification>

	@Prop({ type: Date, default: Date.now(), expires: '3m' })
	notVerified: Date
}

export const MemberSchema = SchemaFactory.createForClass(Member)

MemberSchema.plugin(mongooseDelete)
MemberSchema.plugin(mongooseLeanVirtuals)

MemberSchema.virtual('fullName').get(function () {
	return `${this.firstName} ${this.lastName}`
})

MemberSchema.virtual('variables').get(function () {
	return {
		firstName: this.firstName,
		lastName: this.lastName,
	}
})
