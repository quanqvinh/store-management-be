import { DatabaseConnectionName } from '@/constants'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FileModule, PortalMulterModule } from '@/modules/file/file.module'
import { CouponController } from './coupon.controller'
import { Coupon, CouponSchema } from './schemas/coupon.schema'
import { CouponService } from './coupon.service'
import { SettingModule } from '../setting/setting.module'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Coupon.name, schema: CouponSchema }],
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
