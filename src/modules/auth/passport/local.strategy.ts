import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '../auth.service'
import { UserInfo } from '@/modules/user/schemas/user.schema'
import * as Joi from 'joi'
import { IdentityType } from '@/common/constants'
import Pattern from '@/common/validators'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'identity' })
	}

	async validate(identity: string, password: string): Promise<UserInfo> {
		let identityType: IdentityType
		if (!Joi.string().email().validate(identity).error)
			identityType = IdentityType.EMAIL
		else if (!Joi.string().pattern(Pattern.mobile).validate(identity).error)
			identityType = IdentityType.MOBILE
		else if (
			!Joi.string()
				.pattern(Pattern.username.normal)
				.pattern(Pattern.username.hasLetter)
				.validate(identity).error
		)
			identityType = IdentityType.USERNAME
		else throw new UnauthorizedException('Identity is invalid')
		const user = await this.authService.validateUser(
			identity,
			identityType,
			password
		)
		if (!user)
			throw new UnauthorizedException(identityType + ' or password is wrong')
		return user
	}
}
