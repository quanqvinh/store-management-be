import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types } from 'mongoose'

@Schema({ versionKey: false, timestamps: true })
export class Store {
	_id: ObjectId

	@Prop({ type: String, required: true })
	name: string

	@Prop([{ type: String }])
	images: Array<string>

	@Prop({
		type: {
			open: {
				hour: Number,
				minute: Number,
			},
			close: {
				hour: Number,
				minute: Number,
			},
		},
	})
	dailyTime: {
		open: {
			hour: number
			minute: number
		}
		close: {
			hour: number
			minute: number
		}
	}

	@Prop({ type: String, required: true })
	address: string

	@Prop([
		{
			type: {
				icon: { type: String },
				content: { type: String, required: true },
			},
		},
	])
	description: Array<{
		icon: string
		content: string
	}>

	@Prop([{ type: Types.ObjectId, ref: 'Product' }])
	unavailableProduct: Array<ObjectId>

	createdAt: Date
	updatedAt: Date
}

export const StoreSchema = SchemaFactory.createForClass(Store)
