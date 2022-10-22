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

	@Prop({ type: String })
	size: string

	@Prop([{ type: Types.ObjectId, ref: 'Product' }])
	includeOne: [ObjectId]

	@Prop([{ type: Types.ObjectId, ref: 'Product' }])
	includeAll: [ObjectId]
}

export const ConditionSchema = SchemaFactory.createForClass(Condition)
