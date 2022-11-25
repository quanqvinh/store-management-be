import { MemberRank } from '@/modules/member-rank/schemas/member-rank.schema'
import { OmitType } from '@nestjs/swagger'
import { MemberInfo } from '../member-info.schema'

export class PopulatedMemberInfo extends OmitType(MemberInfo, ['rank']) {
	rank: MemberRank
}
