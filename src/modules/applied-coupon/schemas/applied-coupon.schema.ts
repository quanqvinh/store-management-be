import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId } from 'mongoose'
import { Coupon, CouponSchema } from '@/modules/coupon/schemas/coupon.schema'
import { CouponType } from '@/constants'

export type AppliedCouponDocument = AppliedCoupon & Document

@Schema({
	versionKey: false,
	timestamps: { createdAt: true },
	discriminatorKey: 'type',
})
export class AppliedCoupon {
	_id: ObjectId

	@Prop({ type: CouponSchema, required: true })
	coupon: Coupon

	@Prop({ type: String, enum: Object.keys(CouponType), required: true })
	type: CouponType

	@Prop({ type: Date })
	expireAt: Date

	@Prop({ type: String })
	receivedFrom: string

	createdAt: Date
}

export const AppliedCouponSchema = SchemaFactory.createForClass(AppliedCoupon)
