import { CreatePromotionDto } from './dto/request/create-promotion.dto'
import { JoiValidatePine } from '@/common/pipes'
import { Body, Controller, Post } from '@nestjs/common'
import { PromotionService } from './promotion.service'
import { CreatePromotionDtoSchema } from './dto/request/create-promotion.dto'
import { Get, Query } from '@nestjs/common/decorators'
import { SkipThrottle } from '@nestjs/throttler'
import { JwtAccessTokenGuard, MemberAuth, User } from '@/common/decorators'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '@/common/decorators/auth.decorator'
import { EmployeeRole } from '@/constants'
import {
	GetPromotionListAdminFilterDto,
	GetPromotionListAdminFilterDtoSchema,
} from './dto/request/get-list-for-admin.dto'

@Controller('promotion')
@ApiTags('promotion')
export class PromotionController {
	constructor(private promotionService: PromotionService) {}

	@Post('create')
	async createPromotion(
		@Body(new JoiValidatePine(CreatePromotionDtoSchema))
		body: CreatePromotionDto
	) {
		return await this.promotionService.create(body)
	}

	@Get('member/all')
	@SkipThrottle()
	@JwtAccessTokenGuard()
	async getAllForMember(@User() member: MemberAuth) {
		return await this.promotionService.getAllForMember(member.id)
	}

	@Get('admin/all')
	@SkipThrottle()
	// @Auth(EmployeeRole.ADMIN)
	async getAllForAdmin(
		@Query(new JoiValidatePine(GetPromotionListAdminFilterDtoSchema))
		query: GetPromotionListAdminFilterDto
	) {
		return await this.promotionService.getAllForAdmin(query)
	}
}
