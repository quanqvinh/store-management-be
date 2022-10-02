import { FailedLoginException } from '@/common/exceptions/http'
import { InvalidIdentifierException } from '@/common/exceptions/http'
import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '../services/auth.service'
import { UserInfo } from '@/modules/user/schemas/user.schema'
import * as Joi from 'joi'
import { IdentifierType } from '@/constants'
import Pattern from '@/common/validators'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'identifier' })
	}

	async validate(identifier: string, password: string): Promise<UserInfo> {
		let identifierType: IdentifierType
		if (!Joi.string().email().validate(identifier).error)
			identifierType = IdentifierType.EMAIL
		else if (!Joi.string().pattern(Pattern.mobile).validate(identifier).error)
			identifierType = IdentifierType.MOBILE
		else if (
			!Joi.string()
				.pattern(Pattern.username.normal)
				.pattern(Pattern.username.hasLetter)
				.validate(identifier).error
		)
			identifierType = IdentifierType.USERNAME
		else throw new InvalidIdentifierException()
		const user = await this.authService.validateUser(
			identifier,
			identifierType,
			password
		)
		if (!user) throw new FailedLoginException(identifierType)
		return user
	}
}
