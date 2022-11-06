import { Body, Controller, Get, UnauthorizedException } from '@nestjs/common'
import { UseGuards, Post } from '@nestjs/common'
import {
	LocalAdminGuard,
	LocalSalespersonGuard,
} from '@/common/guards/local-auth.guard'
import {
	User,
	JwtAccessTokenGuard,
	JwtRefreshTokenGuard,
} from '@/common/decorators'
import { TokenService } from '../token/services/token.service'
import { TokenPairDto } from '../token/dto/token-pair.dto'
import { JoiValidatePine } from '@/common/pipes'
import { MemberService } from '../member/member.service'
import { OtpService } from '../token/services/otp.service'
import { MailService } from '../mail/mail.service'
import { MailTemplateService } from '../template/services/mail-template.service'
import { ConfigService } from '@nestjs/config'
import { TransactionService } from '@/common/providers/transaction.service'
import { NotSavedDataException } from '@/common/exceptions/http'
import { expireTimeFormats } from '@/utils'
import { MemberLoginDto, MemberLoginDtoSchema } from './dto/request'
import { MemberVerifyLoginDto, MemberVerifyLoginDtoSchema } from './dto/request'
import { MemberAccountIdentifyDto } from './dto/response/member-account-identify.dto'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly tokenService: TokenService,
		private memberService: MemberService,
		private otpService: OtpService,
		private mailService: MailService,
		private mailTemplateService: MailTemplateService,
		private configService: ConfigService,
		private transactionService: TransactionService
	) {}

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
	async loginMail(
		@Body(new JoiValidatePine(MemberLoginDtoSchema)) loginDto: MemberLoginDto
	) {
		const otpExpireTime = this.configService.get<string>('otp.expire')

		const status = await this.transactionService.execute({
			writeCb: async session => {
				const otp = await this.otpService.generate(loginDto.email, session)
				if (!otp) throw new NotSavedDataException()

				const mailTemplateData = await this.mailTemplateService.getOtpMailData()
				Object.assign(mailTemplateData.data, {
					otpValue: otp.value,
					otpTime: expireTimeFormats(otpExpireTime).text,
				})

				const mailRes = await this.mailService.sendMail({
					recipient: loginDto.email,
					content: mailTemplateData,
				})

				return mailRes
			},
		})

		if (status.error) throw status.error
		return status.result
	}

	@Post('member/otp-verify')
	async verifyLogin(
		@Body(new JoiValidatePine(MemberVerifyLoginDtoSchema))
		memberVerifyLoginDto: MemberVerifyLoginDto
	): Promise<MemberAccountIdentifyDto> {
		const { email, otp } = memberVerifyLoginDto

		const isValidOtp = await this.otpService.verify(email, otp)
		if (!isValidOtp) throw new UnauthorizedException()

		const member = await this.memberService.findByEmail(
			memberVerifyLoginDto.email
		)
		const isNew = !member
		return { isNew, email }
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
