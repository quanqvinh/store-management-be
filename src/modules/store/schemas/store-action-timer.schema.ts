import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export enum StoreActionName {
	DISABLE = 'disable',
}

export type StoreActionTimerDocument = StoreActionTimer & Document

@Schema({
	versionKey: false,
	collection: 'store_action_timer',
	timestamps: { createdAt: true, updatedAt: false },
})
export class StoreActionTimer {
	@Prop({ type: Date, index: { expireAfterSeconds: 0, index: true } })
	expireAt: Date
}

export const StoreActionTimerSchema =
	SchemaFactory.createForClass(StoreActionTimer)
