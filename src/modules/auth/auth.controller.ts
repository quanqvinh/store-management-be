import { Controller, UseGuards, Post, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import LocalAuthGuard from './guards/local-auth.guard'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() request) {
		return request.user
	}
}
