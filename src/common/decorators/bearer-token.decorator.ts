import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { JwtAccessGuard, JwtRefreshGuard } from '../guards/jwt-auth.guard'

export function JwtAccessTokenGuard() {
	return applyDecorators(
		ApiHeader({ name: 'Authorization', description: 'Bearer Access Token' }),
		UseGuards(JwtAccessGuard)
	)
}

export function JwtRefreshTokenGuard() {
	return applyDecorators(
		ApiHeader({ name: 'Authorization', description: 'Bearer Refresh Token' }),
		UseGuards(JwtRefreshGuard)
	)
}
