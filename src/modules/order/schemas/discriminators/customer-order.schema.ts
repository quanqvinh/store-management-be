import { Buyer, OrderType } from '@/constants'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type CustomerOrderDocument = CustomerOrder & Document

@Schema({ versionKey: false })
export class CustomerOrder {
	buyer: Buyer

	@Prop({
		type: String,
		enum: [OrderType.ON_PREMISES],
		required: true,
		default: OrderType.ON_PREMISES,
	})
	type: OrderType.ON_PREMISES
}

export const CustomerOrderSchema = SchemaFactory.createForClass(CustomerOrder)
