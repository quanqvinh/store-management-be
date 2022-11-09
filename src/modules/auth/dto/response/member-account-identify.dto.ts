import { TokenPairDto } from '@/modules/token/dto/token-pair.dto'

export type MemberAccountIdentifyDto =
	| {
			isNewAccount: true
			email: string
	  }
	| {
			isNewAccount: false
			tokens: TokenPairDto
	  }
