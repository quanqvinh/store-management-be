import { Buyer, OrderStatus, OrderType, StoreSatisfaction } from '@/constants'
import {
	DiscountType,
	DiscountTypeSchema,
} from '@/modules/coupon/schemas/discount-type.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type MemberOrderDocument = MemberOrder & Document

class MemberInShort {
	_id: Types.ObjectId
	name: string
	email: string
	mobile: string
}

class CouponInShort {
	_id: Types.ObjectId
	title: string
	code: string
	discount: DiscountType
}

class OrderReview {
	rate: number
	satisfied: Array<StoreSatisfaction>
	content: string
	likeItems: Array<number>
}

@Schema({ versionKey: false })
export class MemberOrder {
	buyer: Buyer.MEMBER

	@Prop({
		type: String,
		enum: Object.values(OrderType),
		required: true,
	})
	type: OrderType

	deliveryAddress?: any
	timer?: any

	@Prop({
		type: {
			id: { type: Types.ObjectId, required: true },
			name: { type: String, required: true },
			email: { type: String, required: true },
			mobile: { type: String, required: true },
		},
	})
	member: MemberInShort

	@Prop({
		type: {
			_id: { type: Types.ObjectId, required: true },
			title: { type: String, required: true },
			code: { type: String, required: true },
			discount: { type: DiscountTypeSchema, required: true },
		},
	})
	coupon?: CouponInShort

	@Prop({ type: Number, min: 0, default: 0 })
	earnedPoint: number

	@Prop({
		type: String,
		enum: Object.values(OrderStatus),
		default: OrderStatus.PREPARING,
	})
	status?: OrderStatus

	@Prop({
		type: {
			rate: { type: Number, min: 0.5, max: 5 },
			satisfied: [{ type: String, enum: Object.values(StoreSatisfaction) }],
			content: { type: String, maxlength: 500 },
			likeItems: [{ type: Number, min: 0 }],
		},
	})
	review?: OrderReview
}

export const MemberOrderSchema = SchemaFactory.createForClass(MemberOrder)
