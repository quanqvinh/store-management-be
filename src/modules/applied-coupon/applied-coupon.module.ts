import { Module } from '@nestjs/common'
import { AppliedCouponController } from './applied-coupon.controller'
import { AppliedCouponService } from './applied-coupon.service'
import { CouponModule } from '../coupon/coupon.module'
import { MemberModule } from '../member/member.module'
import { MemberRankModule } from '../member-rank/member-rank.module'

@Module({
	imports: [CouponModule, MemberModule, MemberRankModule],
	controllers: [AppliedCouponController],
	providers: [AppliedCouponService],
	exports: [AppliedCouponService],
})
export class AppliedCouponModule {}
