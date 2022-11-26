import { Buyer, OrderType, StoreSatisfaction } from '@/constants'
import {
	BookingOrderStatus,
	bookingOrderStatusSchema,
} from '@/modules/setting/schemas'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId, Types } from 'mongoose'

export type MemberOrderDocument = MemberOrder & Document

export class MemberInShort {
	id: ObjectId
	name: string
	email: string
	mobile: string
	rankName: string
}

export class CouponInShort {
	id: ObjectId
	title: string
	code: string
	discountAmount: number
}

class OrderReview {
	rate: number
	satisfied: Array<StoreSatisfaction>
	content: string
	likeItems: Array<number>
}

export class OrderStatusItem extends BookingOrderStatus {
	time?: Date
	checked: boolean
}

const orderStatusItemSchema = {
	...bookingOrderStatusSchema,
	time: { type: Date, default: null },
	checked: { type: Boolean, default: false },
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

	@Prop({ type: [orderStatusItemSchema], _id: false })
	status?: Array<OrderStatusItem>

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
