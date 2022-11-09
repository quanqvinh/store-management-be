import {
	AppliedCoupon,
	AppliedCouponSchema,
} from './schemas/applied-coupon.schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppliedCouponController } from './applied-coupon.controller'
import { AppliedCouponService } from './applied-coupon.service'
import { CouponModule } from '../coupon/coupon.module'
import { DatabaseConnectionName } from '@/constants'
import { MemberModule } from '../member/member.module'

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{
					name: AppliedCoupon.name,
					schema: AppliedCouponSchema,
				},
			],
			DatabaseConnectionName.DATA
		),
		CouponModule,
		MemberModule,
	],
	controllers: [AppliedCouponController],
	providers: [AppliedCouponService],
	exports: [AppliedCouponService],
})
export class AppliedCouponModule {}
