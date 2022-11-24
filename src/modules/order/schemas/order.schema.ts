import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types, Document } from 'mongoose'
import { Buyer, OrderStatus, PaymentType } from '@/constants'
import { OrderItem, OrderItemSchema } from './order-item.schema'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'

export type OrderDocument = Order & Document

export class StoreInShort {
	id: ObjectId | string
	name: string
	address: string
}

@Schema({
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: false },
	discriminatorKey: 'buyer',
})
export class Order {
	_id?: ObjectId

	@Prop({ type: String, enum: Object.values(Buyer), required: true })
	buyer: Buyer

	@Prop({
		type: {
			id: { type: Types.ObjectId, required: true },
			name: { type: String, required: true },
			address: { type: String, required: true },
		},
		required: true,
		_id: false,
	})
	store: StoreInShort

	@Prop({ type: [OrderItemSchema], required: true })
	items: Array<OrderItem>

	@Prop({ type: Number, min: 0, required: true })
	totalPrice: number

	@Prop({
		type: String,
		enum: Object.values(OrderStatus),
		default: OrderStatus.PROCESSING,
	})
	status?: OrderStatus

	@Prop({
		type: String,
		enum: Object.values(PaymentType),
		default: PaymentType.CASH,
	})
	payment: PaymentType

	createdAt?: Date
}

export const OrderSchema = SchemaFactory.createForClass(Order)

OrderSchema.plugin(mongooseLeanVirtuals)
OrderSchema.virtual('variables').get(function () {
	return {}
})
