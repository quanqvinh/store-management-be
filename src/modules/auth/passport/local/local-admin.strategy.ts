import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '../../auth.service'
import Joi from 'joi'
import Pattern from '@/common/validators'
import { FailedLoginException } from '@/common/exceptions/http'
import { EmployeeRole, IdentifierType } from '@/constants'

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
	Strategy,
	'local-admin'
) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'username' })
	}

	async validate(username: string, password: string) {
		if (
			!Joi.string()
				.pattern(Pattern.username.normal)
				.pattern(Pattern.username.hasLetter)
		)
			throw new FailedLoginException(IdentifierType.USERNAME)
		const employee = await this.authService.validateEmployee(
			username,
			EmployeeRole.ADMIN,
			password
		)
		if (!employee) throw new FailedLoginException(IdentifierType.USERNAME)
		return employee
	}
}
