import { JoiValidatePine } from '@/common/pipes'
import {
	Body,
	Controller,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common'
import { Post } from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import {
	CreateMemberRankDto,
	CreateMemberRankDtoSchema,
} from './dto/create-member-rank.dto'
import { MemberRankService } from './member-rank.service'
import { File } from '@/types'

@Controller('member-rank')
export class MemberRankController {
	constructor(private memberRankService: MemberRankService) {}

	@Post('create')
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'icon', maxCount: 1 },
			{ name: 'background', maxCount: 1 },
		])
	)
	async create(
		@UploadedFiles()
		{
			icon,
			background,
		}: {
			icon?: Array<File>
			background?: Array<File>
		},
		@Body(new JoiValidatePine(CreateMemberRankDtoSchema))
		createMemberRankDto: CreateMemberRankDto
	) {
		return !!(await this.memberRankService.create(
			createMemberRankDto,
			icon?.length > 0 ? icon[0] : undefined,
			background?.length > 0 ? background[0] : undefined
		))
	}
}
