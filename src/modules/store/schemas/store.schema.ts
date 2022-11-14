import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types, Document } from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import mongooseDelete from 'mongoose-delete'
import slugGenerator from 'mongoose-slug-generator'

export type StoreDocument = Store & Document

export class Time {
	hour: number
	minute: number
}

export class DailyTime {
	open: Time
	close: Time
}

export const DailyTimeSchema = {
	open: {
		hour: { type: Number, required: true },
		minute: { type: Number, required: true },
	},
	close: {
		hour: { type: Number, required: true },
		minute: { type: Number, required: true },
	},
}

export class Address {
	street: string
	ward: string
	district: string
	city: string
	country: string
}

class StoreDescription {
	icon: string
	content: string
}

@Schema({ versionKey: false, timestamps: true })
export class Store {
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

	@Prop({
		type: DailyTimeSchema,
		_id: false,
		required: true,
	})
	dailyTime: DailyTime

	@Prop({
		type: {
			street: { type: String, required: true },
			ward: { type: String },
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
	description: Array<StoreDescription>

	@Prop({ type: [Types.ObjectId], ref: 'Product' })
	unavailableProducts: Array<ObjectId>

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
StoreSchema.plugin(slugGenerator)

StoreSchema.virtual('mainImage').get(function () {
	return this.images.length > 0 ? this.images[0] : null
})

StoreSchema.virtual('fullAddress').get(function () {
	const { street, ward, district, city, country } = this.address
	return [street, ward, district, city, country]
		.filter(value => !!value)
		.join(', ')
})
