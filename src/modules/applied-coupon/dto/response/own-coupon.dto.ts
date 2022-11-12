import { Coupon } from '@/modules/coupon/schemas/coupon.schema'
import { PickType } from '@nestjs/swagger'
import { AppliedCoupon } from '../../schemas/applied-coupon.schema'

class CustomCoupon extends PickType(Coupon, [
	'_id',
	'title',
	'description',
	'image',
]) {}

export class CustomOwnCoupon extends PickType(AppliedCoupon, [
	'_id',
	'expireAt',
	'startTime',
] as const) {
	detail: CustomCoupon
}

export class OwnCouponDto {
	aboutExpire: Array<CustomOwnCoupon>
	others: Array<CustomOwnCoupon>
}
