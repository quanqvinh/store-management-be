import { Size } from '@/constants'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export class Percentage {
	amount: number
	maxDecrease?: number
}

export class NewPriceDiscount {
	product: Types.ObjectId
	size: Size
	amount?: number
	newPrice: number
}

export class FreeMinIn {
	amount: number
	all?: boolean
	products?: Array<Types.ObjectId>
	category?: Types.ObjectId
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

	@Prop({
		type: [
			{
				product: { type: Types.ObjectId, required: true },
				size: { type: Number, enum: Object.values(Size), required: true },
				amount: { type: Number, min: 1 },
				newPrice: { type: Number, min: 0, required: true },
				_id: false,
			},
		],
	})
	price?: Array<NewPriceDiscount>

	@Prop({
		type: {
			amount: { type: Number, required: true, min: 1, default: 1 },
			all: { type: Boolean, default: true },
			products: [{ type: Types.ObjectId, ref: 'Product' }],
			category: { type: Types.ObjectId, ref: 'Category' },
		},
		_id: false,
	})
	freeMin?: FreeMinIn
}

export const DiscountTypeSchema = SchemaFactory.createForClass(DiscountType)
