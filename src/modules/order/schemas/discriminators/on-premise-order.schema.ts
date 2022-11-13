import { OrderStatus, OrderType } from '@/constants'
import { Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class OnPremiseOrder {
	type: OrderType

	status: OrderStatus
}

export const OnPremiseOrderSchema = SchemaFactory.createForClass(OnPremiseOrder)
