import { OmitType } from '@nestjs/swagger'
import { Coupon } from '../../schemas/coupon.schema'

export class CouponItemForAdmin extends OmitType(Coupon, [
	'discount',
	'description',
	'orderCondition',
	'notification',
	'applyHour',
]) {
	usedTime: number
	ownedAmount: number
}
