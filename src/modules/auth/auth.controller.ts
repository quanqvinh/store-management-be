import {
	LocalAdminGuard,
	LocalMemberGuard,
	LocalSalespersonGuard,
} from '@/common/guards/local-auth.guard'
import { Controller, UseGuards, Post } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { User } from '@/common/decorators/user.decorator'
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator'
import {
	JwtAccessTokenGuard,
	JwtRefreshTokenGuard,
} from '@/common/decorators/bearer-token.decorator'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { LoginDto, TokenDto } from './dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('admin/login')
	@UseGuards(LocalAdminGuard)
	@ApiResponse({ status: 200, type: TokenDto })
	@ApiBody({ type: LoginDto })
	async loginAdmin(@User() user): Promise<TokenDto> {
		return this.authService.generateTokens(user)
	}

	@Post('member/login')
	@UseGuards(LocalMemberGuard)
	@ApiResponse({ status: 200, type: TokenDto })
	@ApiBody({ type: LoginDto })
	async loginMember(@User() user) {
		console.log(user)
		return this.authService.generateTokens(user)
	}

	@Post('salesperson/login')
	@UseGuards(LocalSalespersonGuard)
	@ApiResponse({ status: 200, type: TokenDto })
	@ApiBody({ type: LoginDto })
	async loginSalesperson(@User() user) {
		return this.authService.generateTokens(user)
	}

	@Post('refresh')
	@JwtRefreshTokenGuard()
	@ApiResponse({ status: 200, type: TokenDto })
	async refresh(@User() user) {
		return this.authService.generateTokens(user)
	}

	@JwtAccessTokenGuard()
	@JwtAccessTokenGuard()
	@Get('profile')
	async profile(@User() user) {
		return user
	}
}
