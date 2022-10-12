import { FailedLoginException } from '@/common/exceptions/http'
import { InvalidIdentifierException } from '@/common/exceptions/http'
import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '../../services/auth.service'
import * as Joi from 'joi'
import { IdentifierType } from '@/constants'
import Pattern from '@/common/validators'
import {
	Member,
	MemberInsensitiveData,
} from '@/modules/member/schemas/member.schema'
import { UserRole } from '@/constants/index'

@Injectable()
export class LocalMemberStrategy extends PassportStrategy(
	Strategy,
	'local-member'
) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'identifier' })
	}

	async validate(
		identifier: string,
		password: string
	): Promise<MemberInsensitiveData> {
		let identifierType: IdentifierType
		if (!Joi.string().email().validate(identifier).error)
			identifierType = IdentifierType.EMAIL
		else if (!Joi.string().pattern(Pattern.mobile).validate(identifier).error)
			identifierType = IdentifierType.MOBILE
		else throw new InvalidIdentifierException()
		const user = await this.authService.validateUser<
			Member,
			MemberInsensitiveData
		>(identifier, identifierType, password, UserRole.MEMBER)
		if (!user) throw new FailedLoginException(identifierType)
		return user
	}
}
