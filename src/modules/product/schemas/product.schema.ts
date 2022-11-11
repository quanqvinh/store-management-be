import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Document, Types } from 'mongoose'
import { Option, OptionSchema } from './option.schema'
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals'
import slugGenerator from 'mongoose-slug-generator'

export type ProductDocument = Product & Document

@Schema({ versionKey: false, timestamps: true })
export class Product {
	_id: ObjectId

	@Prop({ type: String, required: true })
	name: string

	@Prop({
		type: String,
		slug: 'name',
		unique: true,
		slug_padding_size: 2,
		index: true,
	})
	slug?: string

	@Prop([{ type: String }])
	images: Array<string>

	@Prop({ type: Number, required: true })
	originalPrice: number

	@Prop({ type: Types.ObjectId, required: true, ref: 'Category' })
	category: Types.ObjectId

	@Prop({ type: String, default: 'No description' })
	description: string

	@Prop({ Type: OptionSchema })
	options: Option

	createdAt: Date
	updatedAt: Date
}

export const ProductSchema = SchemaFactory.createForClass(Product)

ProductSchema.plugin(slugGenerator)
ProductSchema.plugin(mongooseLeanVirtuals)

ProductSchema.virtual('mainImage').get(function () {
	return this.images.length > 0 ? this.images[0] : null
})
