import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Member } from '../../schemas/member.schema'

export class MemberInfoDto extends OmitType(Member, ['auth'] as const) {
	@ApiProperty()
	isVerified: boolean
}
