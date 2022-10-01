import { Controller, UseGuards, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import LocalAuthGuard from './guards/local-auth.guard'
import { User } from '@/common/decorators/user.decorator'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@User() user) {
		return this.authService.generateTokens(user)
	}
}
