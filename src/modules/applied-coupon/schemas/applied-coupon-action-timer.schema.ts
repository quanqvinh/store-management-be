import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export enum AppliedCouponActionName {
	DISABLE = 'disable',
}

export type AppliedCouponActionTimerDocument = AppliedCouponActionTimer &
	Document

@Schema({
	versionKey: false,
	collection: 'applied_coupon_action_timer',
	timestamps: { createdAt: true, updatedAt: false },
})
export class AppliedCouponActionTimer {
	_id?: Types.ObjectId

	@Prop({ type: Date, index: { expireAfterSeconds: 0, index: true } })
	expireAt: Date
}

export const AppliedCouponActionTimerSchema = SchemaFactory.createForClass(
	AppliedCouponActionTimer
)
