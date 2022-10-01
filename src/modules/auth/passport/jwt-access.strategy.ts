import {
	DetectedAbnormalLoginException,
	NotFoundDataException,
} from '@/common/exceptions/http'
import { UserService } from '@/modules/user/user.service'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TokenSubject } from '@/common/constants'
import { JwtPayload } from '@/common/types'

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
	Strategy,
	'access-jwt'
) {
	constructor(
		private configService: ConfigService,
		private userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('jwt.accessToken.secret'),
			jsonWebTokenOptions: { subject: TokenSubject.ACCESS },
		})
	}

	async validate(payload: JwtPayload) {
		const { aud: uid, iat: issuedAt } = payload
		const userAuth = (await this.userService.findById(uid))?.auth
		if (!userAuth) throw new NotFoundDataException('User')
		if (userAuth.validTokenTime > issuedAt * 1000)
			throw new DetectedAbnormalLoginException()
		return { id: uid }
	}
}
