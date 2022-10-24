import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '../../auth.service'
import * as Joi from 'joi'
import { IdentifierType } from '@/constants'
import Pattern from '@/common/validators'
import {
	FailedLoginException,
	InvalidIdentifierException,
} from '@/common/exceptions/http'

@Injectable()
export class LocalMemberStrategy extends PassportStrategy(
	Strategy,
	'local-member'
) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'identifier' })
	}

	async validate(identifier: string, password: string) {
		let identifierType: IdentifierType
		if (!Joi.string().email().validate(identifier).error)
			identifierType = IdentifierType.EMAIL
		else if (!Joi.string().pattern(Pattern.mobile).validate(identifier).error)
			identifierType = IdentifierType.MOBILE
		else throw new InvalidIdentifierException()
		const member = await this.authService.validateMember(
			identifier,
			identifierType,
			password
		)
		if (!member) throw new FailedLoginException(identifierType)
		return member
	}
}
