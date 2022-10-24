import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {
	Product,
	ProductSchema,
} from '@/modules/product/schemas/product.schema'
import { Option, OptionSchema } from '@/modules/product/schemas/option.schema'

@Schema({ versionKey: false, _id: false })
export class DetailOrder {
	@Prop({ type: ProductSchema, required: true })
	product: Product

	@Prop({ type: OptionSchema, required: true })
	option: Option

	@Prop({ type: Number, required: true, min: 0, default: 1 })
	amount: number

	@Prop({ type: Number, min: 0 })
	price: number

	@Prop({ type: String })
	note: string
}

export const DetailOrderSchema = SchemaFactory.createForClass(DetailOrder)
