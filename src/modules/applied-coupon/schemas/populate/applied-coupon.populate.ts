import { Coupon } from '@/modules/coupon/schemas/coupon.schema'
import { OmitType } from '@nestjs/swagger'
import { AppliedCoupon } from '../applied-coupon.schema'

export class PopulatedAppliedCoupon extends OmitType(AppliedCoupon, [
	'coupon',
]) {
	coupon: Coupon
}
