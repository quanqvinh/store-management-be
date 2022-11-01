import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '../../auth.service'
import Joi from 'joi'
import { usernamePattern } from '@/common/validators'
import { FailedLoginException } from '@/common/exceptions/http'
import { EmployeeRole, IdentifierType } from '@/constants'

@Injectable()
export class LocalSalespersonStrategy extends PassportStrategy(
	Strategy,
	'local-salesperson'
) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'username' })
	}

	async validate(username: string, password: string) {
		if (
			!Joi.string()
				.pattern(usernamePattern.normal)
				.pattern(usernamePattern.hasLetter)
		)
			throw new FailedLoginException(IdentifierType.USERNAME)
		const employee = await this.authService.validateEmployee(
			username,
			EmployeeRole.SALESPERSON,
			password
		)
		if (!employee) throw new FailedLoginException(IdentifierType.USERNAME)
		return employee
	}
}
