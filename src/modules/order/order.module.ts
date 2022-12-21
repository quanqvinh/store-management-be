import { AppliedCouponModule } from './../applied-coupon/applied-coupon.module'
import { Order, OrderSchema } from './schemas/order.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { DatabaseConnectionName, Buyer } from '@/constants'
import { CustomerOrderSchema, MemberOrderSchema } from './schemas'
import { OrderController } from './order.controller'
import { OrderService } from './services'
import { StoreModule } from '../store/store.module'
import { ProductModule } from '../product/product.module'
import { MemberModule } from '../member/member.module'
import { SettingModule } from '../setting/setting.module'
import { OrderStream } from './auto/order.stream'
import { MemberRankModule } from '../member-rank/member-rank.module'

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{
					name: Order.name,
					schema: OrderSchema,
					discriminators: [
						{ name: Buyer.CUSTOMER, schema: CustomerOrderSchema },
						{ name: Buyer.MEMBER, schema: MemberOrderSchema },
					],
				},
			],
			DatabaseConnectionName.DATA
		),
		StoreModule,
		ProductModule,
		MemberModule,
		SettingModule,
		MemberRankModule,
		AppliedCouponModule,
	],
	controllers: [OrderController],
	providers: [OrderService, OrderStream],
	exports: [OrderService],
})
export class OrderModule {}
