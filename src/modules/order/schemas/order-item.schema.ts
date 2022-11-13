import { ToppingOption } from './../../product/schemas/option.schema'
import { SizeOption } from '@/modules/product/schemas/option.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

class ProductInShort {
	_id: Types.ObjectId
	name: string
	originalPrice: number
}

class OrderItemOption {
	size?: SizeOption
	topping?: Array<ToppingOption>
}

@Schema({ versionKey: false, _id: false })
export class OrderItem {
	@Prop({
		type: {
			_id: { type: Types.ObjectId, required: true },
			name: { type: Types.ObjectId, required: true },
			originalPrice: { type: Number, required: true },
		},
		required: true,
	})
	product: ProductInShort

	@Prop({
		type: {
			size: { type: String, enum: Object.values(SizeOption) },
			topping: [{ type: String, enum: Object.values(ToppingOption) }],
		},
		default: {},
	})
	option: OrderItemOption

	@Prop({ type: Number, required: true, min: 0, default: 1 })
	amount: number

	@Prop({ type: Number, min: 0 })
	price: number

	@Prop({ type: String })
	note: string
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem)
