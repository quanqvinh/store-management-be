import { PickType } from '@nestjs/swagger'
import { MemberRank } from '../schemas/member-rank.schema'

export class ShortMemberRank extends PickType(MemberRank, [
	'_id',
	'name',
	'rank',
	'display',
]) {}
