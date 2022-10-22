import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types, Document } from 'mongoose'
import { DiscountType, DiscountTypeSchema } from './discount-type.schema'
import { Condition, ConditionSchema } from './condition.schema'
import { CouponType } from '@/constants'
import {
	NotificationContent,
	NotificationContentPropertyDefine,
} from '@/modules/notification/schemas/notification.schema'

export type CouponDocument = Coupon & Document

@Schema({ versionKey: false })
export class Coupon {
	_id: ObjectId

	@Prop({ type: String, required: true })
	title: string

	@Prop({ type: String, required: true })
	code: string

	@Prop({ type: DiscountTypeSchema, required: true })
	discount: DiscountType

	@Prop({ type: String })
	image: string

	@Prop({ type: String, default: 'No description' })
	description: string

	@Prop({ type: ConditionSchema })
	condition: Condition

	@Prop({
		type: String,
		enum: Object.values(CouponType),
		default: CouponType.ONCE,
	})
	type: CouponType

	@Prop({ type: Number, default: 0 })
	applyTime: number

	@Prop([{ type: Types.ObjectId, required: true, ref: 'Product' }])
	applyTo: [ObjectId]

	@Prop({ type: NotificationContentPropertyDefine })
	notification: NotificationContent
}

export const CouponSchema = SchemaFactory.createForClass(Coupon)
