import { User, UserInfo } from '../user/schemas/user.schema'
import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { IdentityType } from '@/common/constants'

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

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
}
