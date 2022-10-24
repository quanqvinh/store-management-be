import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { RefreshService } from '@/modules/token/services/refresh.service'
import { TokenSubject } from '@/constants'
import { JwtPayload } from '@/types'
import { Auth } from '../../schemas/auth.schema'
import { EmployeeService } from '@/modules/employee/employee.service'
import { MemberService } from '@/modules/member/member.service'
import {
	NotFoundDataException,
	DetectedAbnormalLoginException,
	InvalidRefreshTokenException,
	ReusedTokenException,
} from '@/common/exceptions/http'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'refresh-jwt'
) {
	constructor(
		private configService: ConfigService,
		private employeeService: EmployeeService,
		private memberService: MemberService,
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
		const token = await this.refreshService.get(payload)
		if (!token) throw new InvalidRefreshTokenException()

		const { aud: uid, iat: issuedAt, role } = payload
		const auth: Partial<Auth> = {}
		if (role) {
			const employee = await this.employeeService.employeeModel
				.findOne({
					_id: uid,
					role,
				})
				.select('auth')
				.lean()
				.exec()
			Object.assign(auth, employee?.auth)
		} else {
			const member = await this.memberService.memberModel
				.findById(uid)
				.select('auth')
				.lean()
				.exec()
			Object.assign(auth, member?.auth)
		}
		if (Object.keys(auth).length === 0) throw new NotFoundDataException('user')

		if (auth.validTokenTime > issuedAt * 1000)
			throw new DetectedAbnormalLoginException()

		if (await this.refreshService.check(token)) return { id: uid, role }
		else throw new ReusedTokenException()
	}
}
