import { Order, OrderSchema } from './schemas/order.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { DatabaseConnectionName, OrderType } from '@/constants'
import {
	PickupOrderSchema,
	DeliveryOrderSchema,
	OnPremiseOrderSchema,
} from './schemas'

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{
					name: Order.name,
					schema: OrderSchema,
					discriminators: [
						{ name: OrderType.PICKUP, schema: PickupOrderSchema },
						{ name: OrderType.DELIVERY, schema: DeliveryOrderSchema },
						{ name: OrderType.ON_PREMISE, schema: OnPremiseOrderSchema },
					],
				},
			],
			DatabaseConnectionName.DATA
		),
	],
	controllers: [],
	providers: [],
	exports: [],
})
export class OrderModule {}
