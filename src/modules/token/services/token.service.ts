import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Employee } from '@/modules/employee/schemas/employee.schema'
import { Member } from '@/modules/member/schemas/member.schema'
import { TokenSubject } from '@/constants'
import { RefreshService } from './refresh.service'
import { NotCreatedDataException } from '@/common/exceptions/http'
import { TokenPairDto } from '../dto/token-pair.dto'
import { EmployeeAuth, MemberAuth } from '@/common/decorators'

@Injectable()
export class TokenService {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private refreshService: RefreshService
	) {}

	async generateTokenPair(
		user: Member | Employee | MemberAuth | EmployeeAuth
	): Promise<TokenPairDto> {
		const payload = {
			aud: (user as Employee)._id?.toString() ?? (user as EmployeeAuth).id,
			role: user['role'] ?? undefined,
		}
		const tokenPair = {
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
		if (await this.refreshService.save(payload.aud, tokenPair.refresh_token))
			return tokenPair
		throw new NotCreatedDataException()
	}
}
