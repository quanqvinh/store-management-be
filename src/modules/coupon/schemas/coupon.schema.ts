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

	@Prop({ type: String, required: true, index: 'text' })
	title: string

	@Prop({
		type: String,
		required: true,
		unique: true,
		index: 'text',
		set: (v: string) => v.toUpperCase(),
	})
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
	amountApplyHour: number

	@Prop({ type: NotificationContentPropertyDefine, _id: false })
	notification: NotificationContent

	deleted?: boolean
	deletedAt?: Date
}

export const CouponSchema = SchemaFactory.createForClass(Coupon)

CouponSchema.plugin(mongooseDelete, { deletedAt: true })
