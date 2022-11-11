import { CategoryType } from '@/constants'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Document } from 'mongoose'
import slugGenerator from 'mongoose-slug-generator'

export type CategoryDocument = Category & Document

@Schema({ versionKey: false })
export class Category {
	_id?: Types.ObjectId

	@Prop({ type: String, required: true, index: 1 })
	name: string

	@Prop({
		type: String,
		slug: 'name',
		unique: true,
		slug_padding_size: 2,
		index: true,
	})
	slug?: string

	@Prop({
		type: String,
		enum: Object.values(CategoryType),
		default: CategoryType.DRINK,
		required: true,
	})
	type: CategoryType

	@Prop({ type: String })
	image: string

	@Prop({ type: Boolean, default: false })
	hot: boolean

	@Prop({ type: Number, required: true })
	order: number
}

export const CategorySchema = SchemaFactory.createForClass(Category)

CategorySchema.plugin(slugGenerator)
