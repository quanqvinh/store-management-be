import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Document } from 'mongoose'
import { DiscountType, DiscountTypeSchema } from './discount-type.schema'
import { Condition, ConditionSchema } from './condition.schema'
import {
	NotificationContent,
	NotificationContentPropertyDefine,
} from '@/modules/notification/schemas/notification.schema'
import mongooseDelete from 'mongoose-delete'
import { ApiProperty } from '@nestjs/swagger'
import {
	DailyTime,
	DailyTimeSchema,
} from '@/modules/store/schemas/store.schema'

export type CouponDocument = Coupon & Document

@Schema({ versionKey: false })
export class Coupon {
	_id: ObjectId

	@Prop({ type: String, required: true })
	title: string

	@Prop({ type: String, required: true, unique: true, index: 1 })
	code: string

	@Prop({ type: DiscountTypeSchema, required: true })
	@ApiProperty()
	discount: DiscountType

	@Prop({ type: String })
	image: string

	@Prop({ type: String, default: 'No description' })
	description: string

	@Prop({
		type: DailyTimeSchema,
	})
	applyHour?: DailyTime

	@Prop({ type: ConditionSchema })
	@ApiProperty()
	orderCondition: Condition

	@Prop({ type: Number, default: 0 })
	applyTime: number

	@Prop({ type: NotificationContentPropertyDefine, _id: false })
	notification: NotificationContent
}

export const CouponSchema = SchemaFactory.createForClass(Coupon)

CouponSchema.plugin(mongooseDelete)
