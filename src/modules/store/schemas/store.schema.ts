import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types, Document } from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import mongooseDelete from 'mongoose-delete'

export type StoreDocument = Store & Document

export type Time = {
	hour: number
	minute: number
}

export type DailyTime = {
	open: Time
	close: Time
}

export type Address = {
	street: string
	ward: string
	district: string
	city: string
	country: string
}

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
				hour: { type: Number, required: true },
				minute: { type: Number, required: true },
			},
			close: {
				hour: { type: Number, required: true },
				minute: { type: Number, required: true },
			},
		},
		_id: false,
		required: true,
	})
	dailyTime: DailyTime

	@Prop({
		type: {
			street: { type: String, required: true },
			ward: { type: String, required: true },
			district: { type: String, required: true },
			city: { type: String, required: true },
			country: { type: String, required: true },
		},
		_id: false,
		required: true,
	})
	address: Address

	@Prop({ type: Boolean, required: true, default: false })
	openedStatus: boolean

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

StoreSchema.plugin(mongooseLeanVirtuals)
StoreSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
	indexFields: 'all',
})

StoreSchema.virtual('addressName').get(function () {
	return this.address.street
})

StoreSchema.virtual('mainImage').get(function () {
	return this.images.length > 0 ? this.images[0] : null
})
