import { Injectable } from '@nestjs/common'
import { MemberService } from '../member/member.service'
import { EmployeeService } from '../employee/employee.service'
import { HashService } from '@/common/providers/hash.service'
import { EmployeeRole } from '@/constants/index'

@Injectable()
export class AuthService {
	constructor(
		private memberService: MemberService,
		private employeeService: EmployeeService,
		private hashService: HashService
	) {}

	async validateEmployee(
		username: string,
		role: EmployeeRole,
		password: string
	) {
		const employee = await this.employeeService.employeeModel
			.findOne({
				username,
				role,
			})
			.select('auth store role')
			.lean()
			.exec()
		if (
			employee &&
			this.hashService.compare(password, employee.auth.password)
		) {
			employee.auth = undefined
			return employee
		}
		return null
	}
}
// import { EmployeeRole } from '@/constants/index'
// import { HashService } from '@/common/providers/hash.service'
// import { NotCreatedDataException } from '@/common/exceptions/http'
// import { RefreshService } from './refresh.service'
// import { Injectable } from '@nestjs/common'
// import { AdminService } from '@/modules/admin/admin.service'
// import { IdentifierType } from '@/constants'
// import { JwtService } from '@nestjs/jwt'
// import { ConfigService } from '@nestjs/config'
// import { TokenSubject } from '@/constants'
// import { MemberService } from '@/modules/member/member.service'
// import { TokenDto } from '../dto'

// @Injectable()
// export class AuthService {
// 	constructor(
// 		private adminService: AdminService,
// 		private memberService: MemberService,
// 		private jwtService: JwtService,
// 		private configService: ConfigService,
// 		private refreshService: RefreshService,
// 		private hashService: HashService
// 	) {}

// 	// async validateUser<T, U>(
// 	// 	identifier: string,
// 	// 	identifierType: IdentifierType,
// 	// 	password: string,
// 	// 	role: EmployeeRole
// 	// ): Promise<U> {
// 	// 	let user: T
// 	// 	switch (identifierType) {
// 	// 		case IdentifierType.EMAIL:
// 	// 			user = await this.userService.findByEmail<T>(identifier, role)
// 	// 			break
// 	// 		case IdentifierType.MOBILE:
// 	// 			user = (await this.memberService.findByMobile(identifier)) as T
// 	// 			break
// 	// 		case IdentifierType.USERNAME:
// 	// 			user = ((await this.adminService.findByUsername(identifier, true)) ??
// 	// 				(await this.salespersonService.findByUsername(identifier))) as T
// 	// 			break
// 	// 		default:
// 	// 			user = null
// 	// 			break
// 	// 	}

// 	// 	if (
// 	// 		user &&
// 	// 		this.hashService.compare(password, (user as User).auth.password)
// 	// 	) {
// 	// 		// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	// 		const { auth, ...result } = user as User
// 	// 		return result as U
// 	// 	}
// 	// 	return null
// 	// }

// 	async generateTokens(user: any): Promise<TokenDto> {
// 		const payload = { aud: user._id?.toString() || user.id, role: user.role }
// 		const tokens = {
// 			access_token: this.jwtService.sign(payload, {
// 				secret: this.configService.get<string>('jwt.accessToken.secret'),
// 				expiresIn: this.configService.get<string>('jwt.accessToken.expire'),
// 				subject: TokenSubject.ACCESS,
// 			}),
// 			refresh_token: this.jwtService.sign(payload, {
// 				secret: this.configService.get<string>('jwt.refreshToken.secret'),
// 				expiresIn: this.configService.get<string>('jwt.refreshToken.expire'),
// 				subject: TokenSubject.REFRESH,
// 			}),
// 		}
// 		if (await this.refreshService.save(payload.aud, tokens.refresh_token))
// 			return tokens
// 		throw new NotCreatedDataException()
// 	}
// }
