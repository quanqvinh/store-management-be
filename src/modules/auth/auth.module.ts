import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt/dist'
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './services/auth.service'
import { RefreshService } from './services/refresh.service'
import { LocalAdminStrategy } from './passport/local/local-admin.strategy'
import { Token, TokenSchema } from './schemas/token.schema'
import {
	RefreshToken,
	RefreshTokenSchema,
} from './schemas/refresh-token.schema'
import { JwtAccessStrategy } from './passport/jwt/jwt-access.strategy'
import { JwtRefreshStrategy } from './passport/jwt/jwt-refresh.strategy'
import { HashService } from '@/common/providers/hash.service'
import { AdminModule } from '@/modules/admin/admin.module'
import { UserModule } from '@/modules/user/user.module'
import { SalespersonModule } from '@/modules/salesperson/salesperson.module'
import { MemberModule } from '@/modules/member/member.module'
import { LocalMemberStrategy } from './passport/local/local-member.strategy'
import { LocalSalespersonStrategy } from './passport/local/local-salesperson.strategy'

@Module({
	imports: [
		AdminModule,
		UserModule,
		MemberModule,
		SalespersonModule,
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
		HashService,
		RefreshService,
		LocalAdminStrategy,
		LocalMemberStrategy,
		LocalSalespersonStrategy,
		JwtAccessStrategy,
		JwtRefreshStrategy,
	],
})
export class AuthModule {}
