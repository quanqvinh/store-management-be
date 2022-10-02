import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt/dist'
import { Module } from '@nestjs/common'
import { UserModule } from './../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './services/auth.service'
import { RefreshService } from './services/refresh.service'
import { LocalStrategy } from './passport/local.strategy'
import { Token, TokenSchema } from './schemas/token.schema'
import {
	RefreshToken,
	RefreshTokenSchema,
} from './schemas/refresh-token.schema'
import { JwtAccessStrategy } from './passport/jwt-access.strategy'
import { JwtRefreshStrategy } from './passport/jwt-refresh.strategy'
import { HashService } from '@/common/providers/hash.service'

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({}),
		MongooseModule.forFeature([
			{
				name: Token.name,
				schema: TokenSchema,
				discriminators: [
					{ name: RefreshToken.name, schema: RefreshTokenSchema },
				],
			},
		]),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		RefreshService,
		LocalStrategy,
		JwtAccessStrategy,
		JwtRefreshStrategy,
		HashService,
	],
})
export class AuthModule {}
