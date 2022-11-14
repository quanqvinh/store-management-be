import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types } from 'mongoose'
import { ApplyCouponType, CouponSource, CycleType } from '@/constants'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'

export type AppliedCouponDocument = AppliedCoupon & Document

@Schema({
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: false },
	collection: 'applied_coupons',
})
export class AppliedCoupon {
	_id?: ObjectId

	@Prop({ type: Types.ObjectId, required: true, ref: 'Coupon' })
	coupon: ObjectId | string

	@Prop({ type: String, enum: Object.keys(ApplyCouponType), required: true })
	type: ApplyCouponType

	@Prop({ type: String, enum: Object.values(CycleType) })
	cycleType?: CycleType

	@Prop({ type: Date, expires: 0 })
	expireAt: Date

	@Prop({ type: Number, required: true })
	startTime: number

	@Prop({
		type: String,
		enum: Object.values(CouponSource),
		default: CouponSource.AUTO_SYSTEM,
	})
	source: CouponSource

	createdAt?: Date
}

export const AppliedCouponSchema = SchemaFactory.createForClass(AppliedCoupon)

AppliedCouponSchema.plugin(mongooseLeanVirtuals)

AppliedCouponSchema.virtual('active').get(function () {
	return this.startTime <= Date.now()
})
