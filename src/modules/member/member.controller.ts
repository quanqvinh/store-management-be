import { NotCreatedDataException } from '@/common/exceptions/http'
import { CreateMemberDto, CreateMemberDtoSchema } from './dto/create-member.dto'
import { Body, Controller } from '@nestjs/common'
import { Post } from '@nestjs/common'
import { JoiValidatePine } from '@/common/pipes'
import { MemberService } from './member.service'
import { TokenService } from '../token/services/token.service'
import { MemberTypeService } from '../member-type/member-type.service'

@Controller('member')
export class MemberController {
	constructor(
		private memberService: MemberService,
		private tokenService: TokenService,
		private memberTypeService: MemberTypeService
	) {}

	@Post('sign-up')
	async memberSignUp(
		@Body(new JoiValidatePine(CreateMemberDtoSchema))
		createMemberDto: CreateMemberDto
	) {
		const firstMemberType = await this.memberTypeService.getOne({ rank: 0 })
		const member = await this.memberService.create(
			createMemberDto,
			firstMemberType._id.toString()
		)
		if (!member) throw new NotCreatedDataException()
		return this.tokenService.generateTokenPair(member)
	}
}
