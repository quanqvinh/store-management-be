import { Module } from '@nestjs/common'
import { AppliedCouponController } from './applied-coupon.controller'
import { AppliedCouponService } from './applied-coupon.service'
import { CouponModule } from '../coupon/coupon.module'
import { MemberModule } from '../member/member.module'
import { MemberRankModule } from '../member-rank/member-rank.module'
import { MongooseModule } from '@nestjs/mongoose'
import {
	AppliedCouponActionTimer,
	AppliedCouponActionTimerSchema,
} from './schemas/applied-coupon-action-timer.schema'
import { DatabaseConnectionName } from '@/constants'
import { AppliedCouponStream } from './auto/applied-coupon.stream'

@Module({
	imports: [
		CouponModule,
		MemberModule,
		MemberRankModule,
		MongooseModule.forFeature(
			[
				{
					name: AppliedCouponActionTimer.name,
					schema: AppliedCouponActionTimerSchema,
				},
			],
			DatabaseConnectionName.DATA
		),
	],
	controllers: [AppliedCouponController],
	providers: [AppliedCouponService, AppliedCouponStream],
	exports: [AppliedCouponService],
})
export class AppliedCouponModule {}
