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
	CreateMemberTypeDto,
	CreateMemberTypeDtoSchema,
} from './dto/create-member-type.dto'
import { MemberTypeService } from './member-type.service'
import { File } from '@/types'

@Controller('member-type')
export class MemberTypeController {
	constructor(private memberTypeService: MemberTypeService) {}

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
		@Body(new JoiValidatePine(CreateMemberTypeDtoSchema))
		createMemberTypeDto: CreateMemberTypeDto
	) {
		return !!(await this.memberTypeService.create(
			createMemberTypeDto,
			icon?.length > 0 ? icon[0] : undefined,
			background?.length > 0 ? background[0] : undefined
		))
	}
}
