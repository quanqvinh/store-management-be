import { DatabaseConnectionName } from '@/constants'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FileModule, PortalMulterModule } from '@/modules/file/file.module'
import { CouponController } from './coupon.controller'
import { Coupon, CouponSchema } from './schemas/coupon.schema'
import { CouponService } from './coupon.service'
import { SettingModule } from '../setting/setting.module'
import { Order, OrderSchema } from '../order/schemas'
import {
	CouponActionTimer,
	CouponActionTimerSchema,
} from './schemas/coupon-action-timer.schema'

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: Coupon.name, schema: CouponSchema },
				{ name: Order.name, schema: OrderSchema },
				{ name: CouponActionTimer.name, schema: CouponActionTimerSchema },
			],
			DatabaseConnectionName.DATA
		),
		PortalMulterModule,
		SettingModule,
		FileModule,
	],
	controllers: [CouponController],
	providers: [CouponService],
	exports: [CouponService],
})
export class CouponModule {}
