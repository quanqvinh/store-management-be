import { NotSavedDataException } from '@/common/exceptions/http'
import { RefreshService } from './refresh.service'
import { User, UserInfo } from '@/modules/user/schemas/user.schema'
import { Injectable } from '@nestjs/common'
import { UserService } from '@/modules/user/user.service'
import { IdentityType } from '@/common/constants'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { TokenSubject } from '@/common/constants'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private configService: ConfigService,
		private refreshService: RefreshService
	) {}

	async validateUser(
		identity: string,
		identityType: IdentityType,
		password: string
	): Promise<UserInfo> {
		let user: User
		switch (identityType) {
			case IdentityType.EMAIL:
				user = await this.userService.findByEmail(identity)
				break
			case IdentityType.USERNAME:
				user = await this.userService.findByUsername(identity)
				break
			case IdentityType.MOBILE:
				user = await this.userService.findByMobile(identity)
				break
			default:
				user = null
				break
		}
		if (user && user.auth.password === password) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { auth, ...result } = user
			return result
		}
		return null
	}

	async generateTokens(
		user: any
	): Promise<{ access_token: string; refresh_token: string }> {
		const payload = { aud: user._id?.toString() || user.id }
		const tokens = {
			access_token: this.jwtService.sign(payload, {
				secret: this.configService.get<string>('jwt.accessToken.secret'),
				expiresIn: this.configService.get<string>('jwt.accessToken.expire'),
				subject: TokenSubject.ACCESS,
			}),
			refresh_token: this.jwtService.sign(payload, {
				secret: this.configService.get<string>('jwt.refreshToken.secret'),
				expiresIn: this.configService.get<string>('jwt.refreshToken.expire'),
				subject: TokenSubject.REFRESH,
			}),
		}
		if (await this.refreshService.save(payload.aud, tokens.refresh_token))
			return tokens
		throw new NotSavedDataException()
	}
}
