import { OrderStatus, OrderType } from '@/constants'
import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { CouponInShort, MemberInShort, OrderReview } from '..'

@Schema()
export class PickUpOrder {
	type: OrderType
	member: MemberInShort
	status: Exclude<OrderStatus, OrderStatus.DELIVERING>
	coupon: CouponInShort
	earnedPoint: number
	review: OrderReview
}

export const PickupOrderSchema = SchemaFactory.createForClass(PickUpOrder)
