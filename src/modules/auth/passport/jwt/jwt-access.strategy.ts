import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { TokenSubject } from '@/constants'
import { JwtPayload } from '@/types'
import { DetectedAbnormalLoginException, NotFoundDataException } from '@/common/exceptions/http'
import { EmployeeService } from '@/modules/employee/employee.service'
import { MemberService } from '@/modules/member/member.service'
import { Auth } from '../../schemas/auth.schema'

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access-jwt') {
	constructor(
		private configService: ConfigService,
		private employeeService: EmployeeService,
		private memberService: MemberService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('jwt.accessToken.secret'),
			jsonWebTokenOptions: { subject: TokenSubject.ACCESS },
		})
	}

	async validate(payload: JwtPayload) {
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
			const member = await this.memberService.memberModel.findById(uid).select('auth').lean().exec()
			Object.assign(auth, member?.auth)
		}
		if (auth?.validTokenTime) {
			if (auth.validTokenTime > issuedAt * 1000) throw new DetectedAbnormalLoginException()
			return { id: uid, role: role }
		}
		throw new NotFoundDataException('user')
	}
}
