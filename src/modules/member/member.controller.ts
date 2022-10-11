import {
	NotFoundDataException,
	NotMatchedDataException,
} from '@/common/exceptions/http'
import {
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { Body, Param } from '@nestjs/common/decorators'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { MemberService } from './member.service'
import {
	CreateMemberDto,
	CreateMemberSchema,
	UpdateMemberInfoDto,
	UpdateMemberInfoSchema,
} from './dto'
import { JwtAccessGuard } from '@/common/guards/jwt-auth.guard'
import { ApiTagsAndBearer } from '@/common/decorators/api-tag-and-bearer.decorator'
import { ApiResponse } from '@nestjs/swagger'
import { Member } from './schemas/member.schema'
import {
	ObjectIdValidatePine,
	JoiValidatePine,
	EmailValidatePipe,
	MobileValidatePipe,
} from '@/common/pipes'
import { ResponseData } from '@/types'

@ApiTagsAndBearer('member')
@Controller('member')
export class MemberController {
	constructor(private readonly memberService: MemberService) {}

	@UseInterceptors(TransformInterceptor<Member[]>)
	@UseGuards(JwtAccessGuard)
	@Get('list')
	@ApiResponse({ status: 200, type: ResponseData<Member[]> })
	async getAllMember(): Promise<Member[]> {
		return await this.memberService.findAll()
	}

	@UseInterceptors(TransformInterceptor<Member>)
	@UseGuards(JwtAccessGuard)
	@Get('id/:id')
	@ApiResponse({ status: 200, type: ResponseData<Member> })
	async getMemberById(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<Member> {
		const member = await this.memberService.findById(id)
		if (!member) throw new NotFoundDataException('Member')
		return member
	}

	@UseInterceptors(TransformInterceptor<Member>)
	@UseGuards(JwtAccessGuard)
	@Get('email/:email')
	@ApiResponse({ status: 200, type: ResponseData<Member> })
	async getMemberByUsername(@Param('email', EmailValidatePipe) email: string) {
		const member = await this.memberService.findByEmail(email)
		if (!member) throw new NotFoundDataException('Member')
		return member
	}

	@UseInterceptors(TransformInterceptor<Member>)
	@UseGuards(JwtAccessGuard)
	@Get('mobile/:mobile')
	@ApiResponse({ status: 200, type: Member })
	async getMemberByMobile(@Param('mobile', MobileValidatePipe) mobile: string) {
		const member = await this.memberService.findByEmail(mobile)
		if (!member) throw new NotFoundDataException('Member')
		return member
	}

	@UseInterceptors(TransformInterceptor<Member>)
	@UseGuards(JwtAccessGuard)
	@Post()
	@ApiResponse({ status: 201, type: Member })
	async create(
		@Body(new JoiValidatePine(CreateMemberSchema)) dto: CreateMemberDto
	): Promise<Member> {
		try {
			return await this.memberService.create(dto)
		} catch (error) {
			throw error
		}
	}

	@UseGuards(JwtAccessGuard)
	@Patch(':id')
	async updateInfo(
		@Param('id', ObjectIdValidatePine) id: string,
		@Body(new JoiValidatePine(UpdateMemberInfoSchema)) dto: UpdateMemberInfoDto
	): Promise<boolean> {
		const updateResult = await this.memberService.updateInfo(id, dto)
		if (updateResult.matchedCount === 0) throw new NotMatchedDataException()
		return updateResult.modifiedCount === updateResult.matchedCount
	}

	@UseGuards(JwtAccessGuard)
	@Delete(':id')
	async delete(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<boolean> {
		const deleteResult = await this.memberService.delete(id)
		return deleteResult.deletedCount > 0
	}
}
