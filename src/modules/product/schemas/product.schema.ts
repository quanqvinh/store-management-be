import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Document } from 'mongoose'
import { Category, CategorySchema } from './category.schema'
import { Option, OptionSchema } from './option.schema'

export type ProductDocument = Product & Document

@Schema({ versionKey: false, timestamps: true })
export class Product {
	_id: ObjectId

	@Prop({ type: String, required: true })
	name: string

	@Prop([{ type: String }])
	images: Array<string>

	@Prop({ type: Number, required: true })
	originPrice: number

	@Prop({ type: CategorySchema, required: true })
	category: Category

	@Prop({ type: String, default: 'No description' })
	description: string

	@Prop({ Type: OptionSchema })
	options: Option

	createdAt: Date
	updatedAt: Date
}

export const ProductSchema = SchemaFactory.createForClass(Product)
