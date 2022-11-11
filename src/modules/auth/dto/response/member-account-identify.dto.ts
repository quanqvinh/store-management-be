import { TokenPairDto } from '@/modules/token/dto/token-pair.dto'

export class MemberAccountIdentifyDto {
	isNewAccount: boolean
	email?: string
	tokens?: TokenPairDto
}
