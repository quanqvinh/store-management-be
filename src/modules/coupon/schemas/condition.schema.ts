import { OrderType } from '@/constants'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types } from 'mongoose'

export type IncludeProduct = {
	product: ObjectId
	sizeKey: string
	amount: number
}

const IncludeProductSchema = {
	product: { type: Types.ObjectId, required: true, ref: 'Product' },
	sizeKey: { type: String },
	amount: { type: Number, default: 1 },
}

@Schema({ versionKey: false, _id: false })
export class Condition {
	@Prop({ type: Number })
	minPrice: number

	@Prop({ type: Number })
	minAmount: number

	@Prop({ type: String, enum: Object.values(OrderType) })
	orderType: OrderType

	@Prop({
		type: [IncludeProductSchema],
		_id: false,
	})
	includeOne: [IncludeProduct]

	@Prop({
		type: [IncludeProductSchema],
		_id: false,
	})
	includeAll: [IncludeProduct]
}

export const ConditionSchema = SchemaFactory.createForClass(Condition)
