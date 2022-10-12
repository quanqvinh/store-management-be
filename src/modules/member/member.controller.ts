import {
	NotFoundDataException,
	NotMatchedDataException,
} from '@/common/exceptions/http'
import { Controller, Post, Get, Patch, Delete } from '@nestjs/common'
import { Body, Param } from '@nestjs/common/decorators'
import { MemberService } from './member.service'
import {
	CreateMemberDto,
	CreateMemberSchema,
	UpdateMemberInfoDto,
	UpdateMemberInfoSchema,
} from './dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import {
	ObjectIdValidatePine,
	JoiValidatePine,
	EmailValidatePipe,
	MobileValidatePipe,
} from '@/common/pipes'
import { WriteResponse } from '@/types'
import { JwtAccessTokenGuard } from '@/common/decorators/bearer-token.decorator'
import { MemberInfoResponse } from './types'

@Controller('member')
@ApiTags('member')
export class MemberController {
	constructor(private readonly memberService: MemberService) {}

	@Get('list')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: [MemberInfoResponse] })
	async getAllMember(): Promise<MemberInfoResponse[]> {
		return (await this.memberService.findAll()).map(admin => {
			const { auth, ...insensitiveData } = admin
			return {
				...insensitiveData,
				isVerified: auth.isVerified,
			}
		})
	}

	@Get('id/:id')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: MemberInfoResponse })
	async getMemberById(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<MemberInfoResponse> {
		const member = await this.memberService.findById(id)
		if (!member) throw new NotFoundDataException('Member')
		const { auth, ...insensitiveData } = member
		return {
			...insensitiveData,
			isVerified: auth.isVerified,
		}
	}

	@Get('email/:email')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: MemberInfoResponse })
	async getMemberByUsername(
		@Param('email', EmailValidatePipe) email: string
	): Promise<MemberInfoResponse> {
		const member = await this.memberService.findByEmail(email)
		if (!member) throw new NotFoundDataException('Member')
		const { auth, ...insensitiveData } = member
		return {
			...insensitiveData,
			isVerified: auth.isVerified,
		}
	}

	@Get('mobile/:mobile')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: MemberInfoResponse })
	async getMemberByMobile(
		@Param('mobile', MobileValidatePipe) mobile: string
	): Promise<MemberInfoResponse> {
		const member = await this.memberService.findByEmail(mobile)
		if (!member) throw new NotFoundDataException('Member')
		const { auth, ...insensitiveData } = member
		return {
			...insensitiveData,
			isVerified: auth.isVerified,
		}
	}

	@Post()
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 201, type: MemberInfoResponse })
	async create(
		@Body(new JoiValidatePine(CreateMemberSchema)) dto: CreateMemberDto
	): Promise<MemberInfoResponse> {
		try {
			const member = await this.memberService.create(dto)
			const { auth, ...insensitiveData } = member?._doc
			return {
				...insensitiveData,
				isVerified: auth.isVerified,
			}
		} catch (error) {
			throw error
		}
	}

	@Patch(':id')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: WriteResponse })
	async updateInfo(
		@Param('id', ObjectIdValidatePine) id: string,
		@Body(new JoiValidatePine(UpdateMemberInfoSchema)) dto: UpdateMemberInfoDto
	): Promise<WriteResponse> {
		const updateResult = await this.memberService.updateInfo(id, dto)
		if (updateResult.matchedCount === 0) throw new NotMatchedDataException()
		return {
			isSuccess: updateResult.modifiedCount === updateResult.matchedCount,
		}
	}

	@Delete(':id')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: WriteResponse })
	async delete(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<WriteResponse> {
		const deleteResult = await this.memberService.delete(id)
		return { isSuccess: deleteResult.deletedCount > 0 }
	}
}
