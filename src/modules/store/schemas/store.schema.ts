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
	ward?: string
	district: string
	city: string
	country: string
}

// class StoreDescription {
// 	icon: string
// 	content: string
// }

@Schema({ versionKey: false, timestamps: true })
export class Store {
	_id: ObjectId

	@Prop({ type: String, required: true, index: 'text' })
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
			street: { type: String, required: true, index: 'text' },
			ward: { type: String, index: 'text' },
			district: { type: String, required: true, index: 'text' },
			city: { type: String, required: true, index: 'text' },
			country: { type: String, required: true, index: 'text' },
		},
		_id: false,
		required: true,
	})
	address: Address

	@Prop({ type: Boolean, required: true, default: false })
	openedStatus: boolean

	@Prop({ type: Types.ObjectId })
	disableFlag: ObjectId | string

	// @Prop([
	// 	{
	// 		type: {
	// 			icon: { type: String },
	// 			content: { type: String, required: true },
	// 		},
	// 	},
	// ])
	// description: Array<StoreDescription>

	@Prop({ type: [Types.ObjectId], ref: 'Product' })
	unavailableProducts: Array<ObjectId | string>

	createdAt?: Date
	updatedAt?: Date
	deleted?: boolean
	deletedAt?: Date
}

export const StoreSchema = SchemaFactory.createForClass(Store)

StoreSchema.plugin(mongooseLeanVirtuals)
StoreSchema.plugin(mongooseDelete, {
	deletedAt: true,
	indexFields: 'all',
})
StoreSchema.plugin(slugGenerator)

export type VirtualOrderData = {
	mainImage: string
	fullAddress: string
}

StoreSchema.virtual('mainImage').get(function () {
	return this.images.length > 0 ? this.images[0] : null
})

StoreSchema.virtual('fullAddress').get(function () {
	const { street, ward, district, city, country } = this.address
	return [street, ward, district, city, country]
		.filter(value => !!value)
		.join(', ')
})
