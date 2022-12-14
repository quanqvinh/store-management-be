import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export enum ProductActionName {
	DISABLE = 'disable',
}

export type ProductActionTimerDocument = ProductActionTimer & Document

@Schema({
	versionKey: false,
	collection: 'product_action_timer',
	timestamps: { createdAt: true, updatedAt: false },
})
export class ProductActionTimer {
	@Prop({ type: Date, index: { expireAfterSeconds: 0, index: true } })
	expireAt: Date
}

export const ProductActionTimerSchema =
	SchemaFactory.createForClass(ProductActionTimer)
