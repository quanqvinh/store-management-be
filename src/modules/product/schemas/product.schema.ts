import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Document, Types } from 'mongoose'
import { Option, OptionSchema } from './option.schema'
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals'
import slugGenerator from 'mongoose-slug-generator'
import mongooseDelete from 'mongoose-delete'

export type ProductDocument = ProductWithVirtuals & Document

@Schema({ versionKey: false, timestamps: true })
export class Product {
	_id: Types.ObjectId

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

	@Prop({
		type: Types.ObjectId,
		required: true,
		ref: 'Category',
		index: 1,
		set: id => new Types.ObjectId(id),
	})
	category: ObjectId

	@Prop({ type: String, default: 'No description' })
	description: string

	@Prop({ type: OptionSchema })
	options: Option

	@Prop({ type: Number, default: 0 })
	numberOfLikes: number

	createdAt: Date
	updatedAt: Date
}
export class ProductWithVirtuals extends Product {
	mainImage: string
}

export const ProductSchema = SchemaFactory.createForClass(Product)

ProductSchema.plugin(slugGenerator)
ProductSchema.plugin(mongooseLeanVirtuals)
ProductSchema.plugin(mongooseDelete)

ProductSchema.virtual('mainImage').get(function () {
	return this.images?.length > 0 ? this.images[0] : null
})
