import { Body, Controller, Get, UnauthorizedException } from '@nestjs/common'
import { UseGuards, Post } from '@nestjs/common'
import {
	LocalAdminGuard,
	LocalSalespersonGuard,
} from '@/common/guards/local-auth.guard'
import {
	JwtAccessTokenGuard,
	JwtRefreshTokenGuard,
	User,
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
import { NotCreatedDataException } from '@/common/exceptions/http'
import { expireTimeFormats } from '@/utils'
import { MemberLoginDto, MemberLoginDtoSchema } from './dto/request'
import { MemberVerifyLoginDto, MemberVerifyLoginDtoSchema } from './dto/request'
import { MemberAccountIdentifyDto } from './dto/response/member-account-identify.dto'
import { CreateMemberDto, CreateMemberDtoSchema } from '../member/dto'
import { MemberRankService } from '../member-rank/member-rank.service'

@Controller('auth')
export class AuthController {
	constructor(
		private tokenService: TokenService,
		private memberService: MemberService,
		private otpService: OtpService,
		private mailService: MailService,
		private mailTemplateService: MailTemplateService,
		private configService: ConfigService,
		private transactionService: TransactionService,
		private memberRankService: MemberRankService
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
				if (!otp) throw new NotCreatedDataException()

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

	@Post('member/sign-up')
	async memberSignUp(
		@Body(new JoiValidatePine(CreateMemberDtoSchema))
		createMemberDto: CreateMemberDto
	) {
		const firstMemberRank = await this.memberRankService.getOne({ rank: 0 })
		const member = await this.memberService.create(
			createMemberDto,
			firstMemberRank._id.toString()
		)
		if (!member) throw new NotCreatedDataException()
		return this.tokenService.generateTokenPair(member)
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
		const isNewAccount = !member
		return {
			isNewAccount,
			email: isNewAccount ? email : undefined,
			tokens: !isNewAccount
				? await this.tokenService.generateTokenPair(member)
				: undefined,
		}
	}

	@Post('refresh')
	@JwtRefreshTokenGuard()
	async memberRefresh(@User() member) {
		console.log(member)
		return this.tokenService.generateTokenPair(member)
	}

	@Get('profile')
	@JwtAccessTokenGuard()
	profile(@User() user) {
		return user
	}
}
