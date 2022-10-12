import { UserRole } from '@/constants/index'
import { FailedLoginException } from '@/common/exceptions/http'
import { InvalidIdentifierException } from '@/common/exceptions/http'
import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '../../services/auth.service'
import {
	Salesperson,
	SalespersonInfo,
} from '@/modules/salesperson/schemas/salesperson.schema'
import * as Joi from 'joi'
import { IdentifierType } from '@/constants'
import Pattern from '@/common/validators'

@Injectable()
export class LocalSalespersonStrategy extends PassportStrategy(
	Strategy,
	'local-salesperson'
) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'identifier' })
	}

	async validate(
		identifier: string,
		password: string
	): Promise<SalespersonInfo> {
		let identifierType: IdentifierType
		if (!Joi.string().email().validate(identifier).error)
			identifierType = IdentifierType.EMAIL
		else if (
			!Joi.string()
				.pattern(Pattern.username.normal)
				.pattern(Pattern.username.hasLetter)
				.validate(identifier).error
		)
			identifierType = IdentifierType.USERNAME
		else throw new InvalidIdentifierException()
		const user = await this.authService.validateUser<
			Salesperson,
			SalespersonInfo
		>(identifier, identifierType, password, UserRole.SALESPERSON)
		if (!user) throw new FailedLoginException(identifierType)
		return user
	}
}
