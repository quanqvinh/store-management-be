import { JoiValidatePine, ObjectIdValidatePine } from '@/common/pipes'
import {
	CreateAppliedCouponDto,
	CreateAppliedCouponDtoSchema,
} from './dto/create-applied-coupon.dto'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AppliedCouponService } from './applied-coupon.service'
import { JwtAccessTokenGuard, MemberAuth, User } from '@/common/decorators'
import { NotFoundDataException } from '@/common/exceptions/http'
import { ApiTags } from '@nestjs/swagger'
import { CustomOwnCoupon, OwnCouponDto } from './dto/response/own-coupon.dto'

@Controller('applied-coupon')
@ApiTags('applied-coupon')
export class AppliedCouponController {
	constructor(private appliedCouponService: AppliedCouponService) {}

	@Post('create')
	// @JwtAccessTokenGuard()
	async create(
		@Body(new JoiValidatePine(CreateAppliedCouponDtoSchema))
		createAppliedCouponDto: CreateAppliedCouponDto
	) {
		const updateResult = await this.appliedCouponService.create(
			createAppliedCouponDto
		)
		return updateResult.matchedCount === updateResult.modifiedCount
	}

	@Get()
	@JwtAccessTokenGuard()
	async getAllOfMember(@User() member: MemberAuth): Promise<OwnCouponDto> {
		const appliedCouponData = await this.appliedCouponService.getAllOfOne(
			member.id
		)
		const responseData = appliedCouponData
			.filter(appliedCoupon => appliedCoupon['active'])
			.map(appliedCoupon => ({
				_id: appliedCoupon._id,
				expireAt: appliedCoupon.expireAt,
				startTime: appliedCoupon.startTime,
				detail: {
					_id: appliedCoupon.coupon['_id'].toString(),
					title: appliedCoupon.coupon['title'].toString(),
					description: appliedCoupon.coupon['description'].toString(),
					image: appliedCoupon.coupon['image'].toString(),
					applyHour: appliedCoupon.coupon['applyHour'].toString(),
				},
			}))
		const aboutExpireTime = 7 * 24 * 60 * 60 * 1000
		const now = Date.now()
		return {
			aboutExpire: responseData.filter(
				coupon => coupon.expireAt.getTime() - now <= aboutExpireTime
			) as unknown as CustomOwnCoupon[],
			others: responseData.filter(
				coupon => coupon.expireAt.getTime() - now > aboutExpireTime
			) as unknown as CustomOwnCoupon[],
		}
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
