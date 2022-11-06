import { CreateMemberDto, CreateMemberDtoSchema } from './dto/create-member.dto'
import { Body, Controller } from '@nestjs/common'
import { Post } from '@nestjs/common'
import { JoiValidatePine } from '@/common/pipes'
import { MemberService } from './member.service'

@Controller('member')
export class MemberController {
	constructor(private memberService: MemberService) {}

	@Post('sign-up')
	async memberSignUp(
		@Body(new JoiValidatePine(CreateMemberDtoSchema))
		createMemberDto: CreateMemberDto
	) {
		const member = await this.memberService.create(createMemberDto)
		return !!member
	}
}
