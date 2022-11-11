import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtAccessGuard, JwtRefreshGuard } from '../guards/jwt-auth.guard'

export function JwtAccessTokenGuard() {
	return applyDecorators(ApiBearerAuth(), UseGuards(JwtAccessGuard))
}

export function JwtRefreshTokenGuard() {
	return applyDecorators(ApiBearerAuth(), UseGuards(JwtRefreshGuard))
}
