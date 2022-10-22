import { Module } from '@nestjs/common'
import { MemberModule } from '../member/member.module'
import { EmployeeModule } from '../employee/employee.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { LocalAdminStrategy, LocalMemberStrategy, LocalSalespersonStrategy } from './passport/local'
import { HashService } from '@/common/providers/hash.service'
import { JwtAccessStrategy, JwtRefreshStrategy } from './passport/jwt'
import { TokenModule } from '../token/token.module'

@Module({
	imports: [MemberModule, EmployeeModule, TokenModule, PassportModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [
		AuthService,
		HashService,
		LocalAdminStrategy,
		LocalMemberStrategy,
		LocalSalespersonStrategy,
		JwtAccessStrategy,
		JwtRefreshStrategy,
	],
})
export class AuthModule {}
// @Module({
// 	imports: [
// 		AdminModule,
// 		UserModule,
// 		MemberModule,
// 		SalespersonModule,
// 		PassportModule,
// 		JwtModule.register({}),
// 		MongooseModule.forFeature([
// 			{
// 				name: Token.name,
// 				schema: TokenSchema,
// 				discriminators: [
// 					{ name: RefreshToken.name, schema: RefreshTokenSchema },
// 				],
// 			},
// 		]),
// 	],
// 	controllers: [AuthController],
// 	providers: [
// 		AuthService,
// 		HashService,
// 		RefreshService,c
// 		LocalSalespersonStrategy,
// 		JwtAccessStrategy,
// 		JwtRefreshStrategy,
// 	],
// })
// export class AuthModule {}
