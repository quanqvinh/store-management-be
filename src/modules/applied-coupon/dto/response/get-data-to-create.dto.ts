import { ShortMemberRank } from '@/modules/member-rank/dto/short-member-rank-data.dto'
import { ShortCoupon } from '@/modules/promotion/dto/response/promotion-item-admin.dto'

export class DataToCreate {
	memberRanks: ShortMemberRank[]
	coupons: ShortCoupon[]
}
