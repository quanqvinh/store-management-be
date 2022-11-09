import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Document } from 'mongoose'
import { DiscountType, DiscountTypeSchema } from './discount-type.schema'
import { Condition, ConditionSchema } from './condition.schema'
import { ApplyCouponType } from '@/constants'
import {
	NotificationContent,
	NotificationContentPropertyDefine,
} from '@/modules/notification/schemas/notification.schema'
import mongooseDelete from 'mongoose-delete'

export type CouponDocument = Coupon & Document

@Schema({ versionKey: false })
export class Coupon {
	_id: ObjectId

	@Prop({ type: String, required: true })
	title: string

	@Prop({ type: String, required: true, unique: true, index: 1 })
	code: string

	@Prop({ type: DiscountTypeSchema, required: true })
	discount: Partial<DiscountType>

	@Prop({ type: String })
	image: string

	@Prop({ type: String, default: 'No description' })
	description: string

	@Prop({ type: ConditionSchema })
	orderCondition: Partial<Condition>

	@Prop({ type: Number, default: 0 })
	applyTime: number

	@Prop({ type: NotificationContentPropertyDefine, _id: false })
	notification: NotificationContent
}

export const CouponSchema = SchemaFactory.createForClass(Coupon)

CouponSchema.plugin(mongooseDelete)
