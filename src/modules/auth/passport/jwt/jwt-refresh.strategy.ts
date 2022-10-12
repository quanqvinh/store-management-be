import { RefreshService } from '../../services/refresh.service'
import { UserService } from '@/modules/user/user.service'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TokenSubject } from '@/constants'
import {
	NotFoundDataException,
	DetectedAbnormalLoginException,
	InvalidRefreshTokenException,
	ReusedTokenException,
} from '@/common/exceptions/http'
import { JwtPayload } from '@/types'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'refresh-jwt'
) {
	constructor(
		private configService: ConfigService,
		private userService: UserService,
		private refreshService: RefreshService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('jwt.refreshToken.secret'),
			jsonWebTokenOptions: { subject: TokenSubject.REFRESH },
		})
	}

	async validate(payload: JwtPayload) {
		const { aud: uid, iat: issuedAt, role } = payload
		const [user, token] = await Promise.all([
			this.userService.findById(uid, role),
			this.refreshService.get(payload),
		])
		if (!user) throw new NotFoundDataException('User')
		if (!token) throw new InvalidRefreshTokenException()

		if (user.auth.validTokenTime > issuedAt * 1000)
			throw new DetectedAbnormalLoginException()

		if (await this.refreshService.check(token)) return { id: uid, role }
		else throw new ReusedTokenException()
	}
}