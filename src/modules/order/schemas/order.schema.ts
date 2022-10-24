import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types, Document } from 'mongoose'
import { OrderType, PaymentType, StoreSatisfaction } from '@/constants'
import { DetailOrder, DetailOrderSchema } from './detail-order.schema'
import { Coupon, CouponSchema } from '@/modules/coupon/schemas/coupon.schema'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'

export type OrderDocument = Order & Document

@Schema({ versionKey: false, timestamps: { createdAt: true } })
export class Order {
	_id: ObjectId

	@Prop({
		type: {
			id: { type: Types.ObjectId, required: true },
			name: { type: String, required: true },
			avatar: { type: String },
		},
		required: true,
	})
	member: {
		id: ObjectId
		name: string
		avatar: string
	}

	@Prop({
		type: {
			id: { type: Types.ObjectId, required: true },
			name: { type: String, required: true },
			image: { type: String, required: true },
			address: { type: String, required: true },
		},
		required: true,
	})
	store: {
		id: ObjectId
		name: string
		image: string
		address: string
	}

	@Prop({
		type: String,
		enum: Object.values(OrderType),
		default: OrderType.ON_PREMISE,
	})
	type: OrderType

	@Prop({ type: DetailOrderSchema, required: true })
	detail: DetailOrder

	@Prop({ type: Number, min: 0, required: true })
	totalPrice: number

	@Prop({ type: CouponSchema })
	coupon?: Coupon

	@Prop({ type: Number, min: 0, default: 0 })
	earnedPoint: number

	@Prop({
		type: String,
		enum: Object.values(PaymentType),
		default: PaymentType.CASH,
	})
	payment: PaymentType

	@Prop({
		type: {
			rate: { type: Number, required: true },
			content: { type: String },
		},
	})
	productReview?: {
		rate: number
		content: string
	}

	@Prop({
		type: {
			rate: { type: Number, required: true },
			satisfied: [{ type: String, enum: Object.values(StoreSatisfaction) }],
			content: { type: String },
		},
	})
	storeReview?: {
		rate: number
		satisfied: Array<StoreSatisfaction>
		content: string
	}

	createdAt: Date
}

export const OrderSchema = SchemaFactory.createForClass(Order)

OrderSchema.plugin(mongooseLeanVirtuals)
OrderSchema.virtual('variables').get(function () {
	return {}
})
