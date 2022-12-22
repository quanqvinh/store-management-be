import { OmitType, PickType } from '@nestjs/swagger'
import { Promotion, PromotionPrivilege } from '../../schemas/promotion.schema'
import { Coupon } from '@/modules/coupon/schemas/coupon.schema'
import { MemberRankDisplay } from '@/modules/member-rank/schemas/member-rank.schema'

export class PromotionApplyTo {
	_id: string
	name: string
	display: MemberRankDisplay
	sold: number
	limit: number
}

export class PopulatedPrivilege extends OmitType(PromotionPrivilege, [
	'applyTo',
]) {
	applyTo: {
		_id: string
		name: string
		display: MemberRankDisplay
	}
}

export class ShortCoupon extends PickType(Coupon, ['_id', 'code', 'title']) {}

export class PromotionItemAdminDto extends PickType(Promotion, [
	'_id',
	'title',
	'cost',
	'opening',
	'deleted',
	'deletedAt',
]) {
	coupon: ShortCoupon
	applyTo: Array<PromotionApplyTo>
}
