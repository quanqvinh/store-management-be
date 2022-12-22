import { Coupon } from '@/modules/coupon/schemas/coupon.schema'
import { MemberRank } from '@/modules/member-rank/schemas/member-rank.schema'
import { PickType } from '@nestjs/swagger'

class ShortMemberRank extends PickType(MemberRank, [
	'_id',
	'name',
	'rank',
	'display',
]) {}
class ShortCoupon extends PickType(Coupon, ['_id', 'title', 'code', 'image']) {}

export class DataToCreate {
	memberRanks: ShortMemberRank[]
	coupons: ShortCoupon[]
}
