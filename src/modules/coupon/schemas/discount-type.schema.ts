import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export class Percentage {
	amount: number
	maxDecrease?: number
}

@Schema({ versionKey: false, _id: false })
export class DiscountType {
	@Prop({
		type: {
			amount: { type: Number, required: true },
			maxDecrease: { type: Number },
		},
		_id: false,
	})
	percentage?: Percentage

	@Prop({ type: Number })
	decrease?: number

	@Prop({ type: Number })
	price?: number

	@Prop({ type: Boolean })
	freeMin?: boolean
}

export const DiscountTypeSchema = SchemaFactory.createForClass(DiscountType)
