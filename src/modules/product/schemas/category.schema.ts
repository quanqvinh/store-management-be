import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import slugGenerator from 'mongoose-slug-generator'

@Schema({ versionKey: false, _id: false })
export class Category {
	@Prop({ type: String, required: true })
	name: string

	@Prop({ type: String })
	image: string

	@Prop({ type: String, slug: 'name' })
	slug?: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)

CategorySchema.plugin(slugGenerator)

CategorySchema.index({ name: 1, slug: 1 })
