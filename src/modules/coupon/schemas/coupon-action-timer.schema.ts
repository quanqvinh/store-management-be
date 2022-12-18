import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export enum CouponActionName {
	DISABLE = 'disable',
}

export type CouponActionTimerDocument = CouponActionTimer & Document

@Schema({
	versionKey: false,
	collection: 'coupon_action_timer',
	timestamps: { createdAt: true, updatedAt: false },
})
export class CouponActionTimer {
	@Prop({ type: Date, index: { expireAfterSeconds: 0, index: true } })
	expireAt: Date
}

export const CouponActionTimerSchema =
	SchemaFactory.createForClass(CouponActionTimer)
