import { Buyer, OrderStatus, OrderType } from '@/constants'
import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type CustomerOrderDocument = CustomerOrder & Document

@Schema({ versionKey: false })
export class CustomerOrder {
	buyer: Buyer.CUSTOMER

	type: OrderType.ON_PREMISE

	status: Exclude<OrderStatus, OrderStatus.DELIVERING | OrderStatus.READY>
}

export const CustomerOrderSchema = SchemaFactory.createForClass(CustomerOrder)
