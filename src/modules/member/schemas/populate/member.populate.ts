import { MemberRank } from '@/modules/member-rank/schemas/member-rank.schema'
import { OmitType } from '@nestjs/swagger'
import { MemberInfo } from '../member-info.schema'
import { Member } from '../member.schema'

export class PopulatedMemberInfo extends OmitType(MemberInfo, ['rank']) {
	totalPoint?: number
	rank: MemberRank
}

export class PopulatedMemberStaffView extends OmitType(Member, [
	'auth',
	'memberInfo',
	'favorite',
	'coupons',
	'notifications',
]) {
	memberInfo: PopulatedMemberInfo
}
