import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export enum PromotionActionName {
	DISABLE = 'disable',
}

export type PromotionActionTimerDocument = PromotionActionTimer & Document

@Schema({
	versionKey: false,
	collection: 'promotion_action_timer',
	timestamps: { createdAt: true, updatedAt: false },
})
export class PromotionActionTimer {
	@Prop({ type: Date, index: { expireAfterSeconds: 0, index: true } })
	expireAt: Date
}

export const PromotionActionTimerSchema =
	SchemaFactory.createForClass(PromotionActionTimer)
