import { Buyer, OrderType, StoreSatisfaction } from '@/constants'
import {
	DiscountType,
	DiscountTypeSchema,
} from '@/modules/coupon/schemas/discount-type.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId, Types } from 'mongoose'

export type MemberOrderDocument = MemberOrder & Document

class MemberInShort {
	id: ObjectId
	name: string
	email: string
	mobile: string
}

export class CouponInShort {
	id: ObjectId
	title: string
	code: string
	discount: DiscountType
	discountAmount: number
}

class OrderReview {
	rate: number
	satisfied: Array<StoreSatisfaction>
	content: string
	likeItems: Array<number>
}

@Schema({ versionKey: false })
export class MemberOrder {
	buyer: Buyer

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
		_id: false,
	})
	member: MemberInShort

	@Prop({
		type: {
			id: { type: Types.ObjectId, required: true },
			title: { type: String, required: true },
			code: { type: String, required: true },
			discount: { type: DiscountTypeSchema, required: true },
			discountAmount: { type: Number, required: true },
		},
		_id: false,
	})
	coupon?: CouponInShort

	@Prop({ type: Number, min: 0, default: 0 })
	earnedPoint: number

	@Prop({
		type: {
			rate: { type: Number, min: 0.5, max: 5 },
			satisfied: [{ type: String, enum: Object.values(StoreSatisfaction) }],
			content: { type: String, maxlength: 500 },
			likeItems: [{ type: Number, min: 0 }],
		},
		_id: false,
	})
	review?: OrderReview
}

export const MemberOrderSchema = SchemaFactory.createForClass(MemberOrder)
