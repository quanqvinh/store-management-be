import {
	SizeOptionSchema,
	ToppingOption,
	ToppingOptionSchema,
} from './../../product/schemas/option.schema'
import { SizeOption } from '@/modules/product/schemas/option.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ versionKey: false, _id: false })
export class OrderItem {
	@Prop({ type: Types.ObjectId, required: true })
	productId: Types.ObjectId

	@Prop({ type: String, required: true })
	name: string

	@Prop({ type: Types.ObjectId, required: true })
	categoryId: Types.ObjectId

	@Prop({ type: Types.ObjectId, required: true })
	originalPrice: number

	@Prop({ type: SizeOptionSchema, _id: false })
	size?: SizeOption

	@Prop({ type: [ToppingOptionSchema] })
	toppings?: Array<ToppingOption>

	@Prop({ type: Number, required: true, min: 0, default: 1 })
	amount: number

	@Prop({ type: Number, min: 0 })
	itemPrice: number

	@Prop({ type: String, maxlength: 50 })
	note: string
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem)
