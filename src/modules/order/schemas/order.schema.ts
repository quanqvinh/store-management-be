import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types, Document } from 'mongoose'
import {
	Buyer,
	OrderStatus,
	OrderType,
	PaymentType,
	StoreSatisfaction,
} from '@/constants'
import { OrderItem, OrderItemSchema } from './order-item.schema'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import {
	DiscountType,
	DiscountTypeSchema,
} from '@/modules/coupon/schemas/discount-type.schema'

export type OrderDocument = Order & Document

export class MemberInShort {
	isMember: boolean
	_id?: ObjectId
	name?: string
	email?: string
	mobile?: string
}

class StoreInShort {
	_id: ObjectId
	name: string
	address: string
}

export class CouponInShort {
	_id: Types.ObjectId
	title: string
	code: string
	discount: DiscountType
}

export class OrderReview {
	rate: number
	satisfied: Array<StoreSatisfaction>
	content: string
	likeItems: Array<number>
}

@Schema({
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: false },
	discriminatorKey: 'type',
})
export class Order {
	_id?: ObjectId

	// @Prop({
	// 	type: {
	// 		id: { type: Types.ObjectId, required: true },
	// 		name: { type: String, required: true },
	// 		email: { type: String, required: true },
	// 		mobile: { type: String, required: true },
	// 	},
	// })
	// member?: MemberInShort

	buyer: Buyer

	@Prop({
		type: {
			id: { type: Types.ObjectId, required: true },
			name: { type: String, required: true },
			address: { type: String, required: true },
		},
		required: true,
	})
	store: StoreInShort

	@Prop({
		type: String,
		enum: Object.values(OrderType),
		default: OrderType.ON_PREMISE,
	})
	type: OrderType

	@Prop({ type: [OrderItemSchema], required: true })
	items: Array<OrderItem>

	@Prop({ type: Number, min: 0, required: true })
	totalPrice: number

	// @Prop({
	// 	type: {
	// 		_id: { type: Types.ObjectId, required: true },
	// 		title: { type: String, required: true },
	// 		code: { type: String, required: true },
	// 		discount: { type: DiscountTypeSchema, required: true },
	// 	},
	// })
	// coupon?: CouponInShort

	// @Prop({ type: Number, min: 0, default: 0 })
	// earnedPoint?: number

	// @Prop({
	// 	type: String,
	// 	enum: Object.values(OrderStatus),
	// 	default: OrderStatus.PENDING,
	// })
	// status: OrderStatus

	@Prop({
		type: String,
		enum: Object.values(PaymentType),
		default: PaymentType.CASH,
	})
	payment: PaymentType

	@Prop({ type: Boolean, default: false })
	paidStatus: boolean

	// @Prop({
	// 	type: {
	// 		rate: { type: Number, min: 0.5, max: 5 },
	// 		satisfied: [{ type: String, enum: Object.values(StoreSatisfaction) }],
	// 		content: { type: String, maxlength: 500 },
	// 		likeItems: [{ type: Number, min: 0 }],
	// 	},
	// })
	// review?: OrderReview

	createdAt: Date
}

export const OrderSchema = SchemaFactory.createForClass(Order)

OrderSchema.plugin(mongooseLeanVirtuals)
OrderSchema.virtual('variables').get(function () {
	return {}
})
