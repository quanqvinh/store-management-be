import { MailModule } from '@/modules/mail/mail.module'
import { TemplateModule } from '@/modules/template/template.module'
import { Module } from '@nestjs/common'
import { MemberModule } from '../member/member.module'
import { EmployeeModule } from '../employee/employee.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import {
	LocalAdminStrategy,
	// LocalMemberStrategy,
	LocalSalespersonStrategy,
} from './passport/local'
import { HashService } from '@/common/providers/hash.service'
import { JwtAccessStrategy, JwtRefreshStrategy } from './passport/jwt'
import { TokenModule } from '../token/token.module'
import { TransactionService } from '@/common/providers/transaction.service'

@Module({
	imports: [
		MemberModule,
		EmployeeModule,
		TokenModule,
		PassportModule,
		JwtModule.register({}),
		MailModule,
		TemplateModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		HashService,
		LocalAdminStrategy,
		// LocalMemberStrategy,
		LocalSalespersonStrategy,
		JwtAccessStrategy,
		JwtRefreshStrategy,
		TransactionService,
	],
})
export class AuthModule {}
