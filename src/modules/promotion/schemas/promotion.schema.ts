import {
	Category,
	CategorySchema,
} from '@/modules/product/schemas/category.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, ObjectId, Document } from 'mongoose'

export type PromotionDocument = Document & Promotion

@Schema({ versionKey: false, timestamps: true })
export class Promotion {
	_id: ObjectId

	@Prop({ type: String, required: true })
	title: string

	@Prop({ type: Types.ObjectId, ref: 'Coupon', required: true })
	reward: ObjectId

	@Prop({ type: Number, required: true })
	cost: number

	@Prop({
		type: {
			applyTo: { type: Types.ObjectId, required: true, ref: 'MemberType' },
			beginDay: { type: Date, required: true },
			endDay: { type: Date },
			limit: { type: Number },
			inStock: { type: Number },
		},
		required: true,
	})
	privilege: Array<{
		applyTo: ObjectId
		beginDay: Date
		endDay: Date
		limit: number
		inStock: number
	}>

	@Prop({ type: Types.ObjectId, ref: 'Partner' })
	partner: ObjectId

	@Prop({ type: CategorySchema, required: true })
	category: Category

	createAt: Date
	updatedAt: Date
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion)
