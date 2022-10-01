import { JwtRefreshGuard } from '@/common/guards/jwt-auth.guard'
import { JwtAccessGuard } from '@/common/guards/jwt-auth.guard'
import { LocalAuthGuard } from '@/common/guards/local-auth.guard'
import { Controller, UseGuards, Post } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { User } from '@/common/decorators/user.decorator'
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@User() user) {
		return this.authService.generateTokens(user)
	}

	@UseGuards(JwtRefreshGuard)
	@Post('refresh')
	async refresh(@User() user) {
		return this.authService.generateTokens(user)
	}

	@UseGuards(JwtAccessGuard)
	@Get('profile')
	async profile(@User() user) {
		return user
	}
}
