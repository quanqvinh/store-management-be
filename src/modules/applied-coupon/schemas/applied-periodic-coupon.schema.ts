import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AppliedCoupon } from './applied-coupon.schema'
import { Document } from 'mongoose'
import { CycleType } from '@/constants'

export type AppliedPeriodicCouponDocument = AppliedPeriodicCoupon & Document

@Schema({ versionKey: false })
export class AppliedPeriodicCoupon extends AppliedCoupon {
	@Prop({ type: Boolean, default: false })
	active: boolean

	@Prop({ type: String, enum: Object.values(CycleType), required: true })
	cycleType: CycleType

	@Prop({ type: Date, required: true })
	startDate: Date
}

export const AppliedPeriodicCouponSchema = SchemaFactory.createForClass(AppliedPeriodicCoupon)
