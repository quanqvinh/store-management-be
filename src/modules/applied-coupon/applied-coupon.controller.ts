import { JoiValidatePine, ObjectIdValidatePine } from '@/common/pipes'
import {
	CreateAppliedCouponDto,
	CreateAppliedCouponDtoSchema,
} from './dto/create-applied-coupon.dto'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AppliedCouponService } from './applied-coupon.service'
import {
	EmployeeAuth,
	JwtAccessTokenGuard,
	MemberAuth,
	User,
} from '@/common/decorators'
import { NotFoundDataException } from '@/common/exceptions/http'

@Controller('applied-coupon')
export class AppliedCouponController {
	constructor(private appliedCouponService: AppliedCouponService) {}

	@Post('create-one')
	@JwtAccessTokenGuard()
	async createForOne(
		@User() member: EmployeeAuth,
		@Body(new JoiValidatePine(CreateAppliedCouponDtoSchema))
		createAppliedCouponDto: CreateAppliedCouponDto
	) {
		return !!(await this.appliedCouponService.create(
			member.id,
			createAppliedCouponDto
		))
	}

	@Get()
	@JwtAccessTokenGuard()
	async getAllOfMember(@User() member: MemberAuth) {
		return await this.appliedCouponService.getAllOfOne(member.id)
	}

	@Get(':id')
	@JwtAccessTokenGuard()
	async getOne(
		@User() member: MemberAuth,
		@Param('id', ObjectIdValidatePine) appliedCouponId: string
	) {
		const coupon = await this.appliedCouponService.getOne(
			member.id,
			appliedCouponId
		)
		if (!coupon) throw new NotFoundDataException('Coupon')
	}
}
