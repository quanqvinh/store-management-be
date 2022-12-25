import { CreatePromotionDto } from './dto/request/create-promotion.dto'
import { JoiValidatePine, ObjectIdValidatePine } from '@/common/pipes'
import { Body, Controller, Post } from '@nestjs/common'
import { PromotionService } from './promotion.service'
import { CreatePromotionDtoSchema } from './dto/request/create-promotion.dto'
import { Get, Param, Patch, Query } from '@nestjs/common/decorators'
import { SkipThrottle } from '@nestjs/throttler'
import { JwtAccessTokenGuard, MemberAuth, User } from '@/common/decorators'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '@/common/decorators/auth.decorator'
import { EmployeeRole } from '@/constants'
import {
	GetPromotionListAdminFilterDto,
	GetPromotionListAdminFilterDtoSchema,
} from './dto/request/get-list-for-admin.dto'
import {
	UpdatePromotionDto,
	UpdatePromotionDtoSchema,
} from './dto/request/update-promotion.đto'
import {
	DisablePromotionDto,
	DisablePromotionDtoSchema,
} from './dto/request/disable-promotion.dto'

@Controller('promotion')
@ApiTags('promotion')
export class PromotionController {
	constructor(private promotionService: PromotionService) {}

	@Get('relation-data')
	@SkipThrottle()
	async getRelationData() {
		return await this.promotionService.getRelationData()
	}

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

	@Patch(':id')
	// @Auth(EmployeeRole.ADMIN)
	async updatePromotion(
		@Param('id', ObjectIdValidatePine) promotionId: string,
		@Body(new JoiValidatePine(UpdatePromotionDtoSchema))
		body: UpdatePromotionDto
	) {
		return await this.promotionService.update(promotionId, body)
	}

	@Patch(':id/disable')
	// @Auth(EmployeeRole.ADMIN)
	async disableProduct(
		@Param('id', ObjectIdValidatePine) productId: string,
		@Query(new JoiValidatePine(DisablePromotionDtoSchema))
		query: DisablePromotionDto
	) {
		if (query.instantly === 'true') {
			return await this.promotionService.disable(productId)
		} else {
			return await this.promotionService.addDisableFlag(productId, query.timer)
		}
	}

	@Patch(':id/enable')
	// @Auth(EmployeeRole.ADMIN)
	async enableProduct(@Param('id', ObjectIdValidatePine) productId: string) {
		return await this.promotionService.enable(productId)
	}

	@Post('apply/:id')
	@JwtAccessTokenGuard()
	async exchangeCoupon(
		@User() member: MemberAuth,
		@Param('id', ObjectIdValidatePine) promotionId: string
	) {
		return await this.promotionService.exchangeCoupon(member.id, promotionId)
	}
}
