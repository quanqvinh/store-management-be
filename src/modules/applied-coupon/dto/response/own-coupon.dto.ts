import { Coupon } from '@/modules/coupon/schemas/coupon.schema'
import { PickType } from '@nestjs/swagger'
import { AppliedCoupon } from '../../schemas/applied-coupon.schema'

class CustomCoupon extends PickType(Coupon, [
	'code',
	'title',
	'description',
	'image',
	'applyHour',
	'_id',
]) {}

export class CustomOwnCoupon extends PickType(AppliedCoupon, [
	'expireAt',
	'_id',
] as const) {
	detail: CustomCoupon
	startTime: Date
}

export class OwnCouponDto {
	aboutExpire: Array<CustomOwnCoupon>
	others: Array<CustomOwnCoupon>
}
