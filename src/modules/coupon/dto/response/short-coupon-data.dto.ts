import { PickType } from '@nestjs/swagger'
import { Coupon } from '../../schemas/coupon.schema'

export class ShortCoupon extends PickType(Coupon, [
	'_id',
	'title',
	'code',
	'image',
]) {}
