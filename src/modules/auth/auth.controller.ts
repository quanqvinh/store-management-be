import { Controller, Get } from '@nestjs/common'
import { UseGuards, Post } from '@nestjs/common'
import {
	LocalAdminGuard,
	LocalMemberGuard,
	LocalSalespersonGuard,
} from '@/common/guards/local-auth.guard'
import { User, JwtAccessTokenGuard, JwtRefreshTokenGuard } from '@/common/decorators'
import { TokenService } from '../token/services/token.service'
import { TokenPairDto } from '../token/dto/token-pair.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly tokenService: TokenService) {}

	@Post('admin/login')
	@UseGuards(LocalAdminGuard)
	async adminLogin(@User() user): Promise<TokenPairDto> {
		return await this.tokenService.generateTokenPair(user)
	}

	@Post('salesperson/login')
	@UseGuards(LocalSalespersonGuard)
	async salespersonLogin(@User() user): Promise<TokenPairDto> {
		return await this.tokenService.generateTokenPair(user)
	}

	@Post('member/login')
	@UseGuards(LocalMemberGuard)
	async memberLogin(@User() user): Promise<TokenPairDto> {
		return await this.tokenService.generateTokenPair(user)
	}

	@Post('refresh')
	@JwtRefreshTokenGuard()
	async refresh(@User() user) {
		return this.tokenService.generateTokenPair(user)
	}

	@Get('profile')
	@JwtAccessTokenGuard()
	profile(@User() user) {
		return user
	}
}
