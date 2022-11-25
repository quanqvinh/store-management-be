import { MemberRank } from '@/modules/member-rank/schemas/member-rank.schema'
import { OmitType } from '@nestjs/swagger'
import { MemberInfo, MemberInfoVirtual } from '../member-info.schema'

export class PopulatedMemberInfo extends OmitType(MemberInfo, ['rank']) {
	totalPoint?: number
	rank: MemberRank
}
