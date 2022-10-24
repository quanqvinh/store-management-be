import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types } from 'mongoose'

@Schema({ versionKey: false, _id: false })
export class Condition {
	@Prop({ type: Number })
	minPrice: number

	@Prop({ type: Number })
	minAmount: number

	@Prop({ type: String })
	orderType: string

	@Prop([
		{
			type: {
				product: { type: Types.ObjectId, required: true, ref: 'Product' },
				sizeKey: { type: String },
			},
		},
	])
	includeOne: [ObjectId]

	@Prop([
		{
			type: {
				product: { type: Types.ObjectId, required: true, ref: 'Product' },
				sizeKey: { type: String },
			},
		},
	])
	includeAll: [ObjectId]
}

export const ConditionSchema = SchemaFactory.createForClass(Condition)
