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
	coupon: Types.ObjectId | string

	@Prop({ type: String, enum: Object.values(ApplyCouponType), required: true })
	type: ApplyCouponType

	@Prop({ type: String, enum: Object.values(CycleType) })
	cycleType?: CycleType

	@Prop({ type: Date })
	expireAt: Date

	@Prop({ type: Number, required: true })
	startTime: number

	@Prop({
		type: String,
		enum: Object.values(CouponSource),
		default: CouponSource.AUTO_SYSTEM,
	})
	source: CouponSource

	@Prop({ type: Types.ObjectId })
	expireFlagId?: Types.ObjectId

	createdAt?: Date
}

export const AppliedCouponSchema = SchemaFactory.createForClass(AppliedCoupon)

AppliedCouponSchema.plugin(mongooseLeanVirtuals)

AppliedCouponSchema.virtual('active').get(function () {
	return this.startTime <= Date.now()
})
