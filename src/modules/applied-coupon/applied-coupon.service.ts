import { NotFoundDataException } from '@/common/exceptions/http'
import { ApplyCouponType, DatabaseConnectionName } from '@/constants'
import { CouponService } from '@/modules/coupon/coupon.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Member, MemberDocument } from '../member/schemas/member.schema'
import { CreateAppliedCouponDto } from './dto/create-applied-coupon.dto'
import { AppliedCoupon } from './schemas/applied-coupon.schema'
import { UpdateResult } from 'mongodb'
import { Coupon } from '../coupon/schemas/coupon.schema'
import { CustomOwnCoupon } from './dto/response/own-coupon.dto'

@Injectable()
export class AppliedCouponService {
	constructor(
		@InjectModel(Member.name, DatabaseConnectionName.DATA)
		private readonly memberModel: Model<MemberDocument>,
		private couponService: CouponService
	) {}

	async create(dto: CreateAppliedCouponDto): Promise<UpdateResult> {
		const coupon = await this.couponService.getById(dto.couponId)

		dto.startTime = +dto.startTime

		if (dto.startTime === 0) dto.startTime = Date.now()

		const appliedCoupon: AppliedCoupon = {
			coupon: dto.couponId,
			type: dto.type,
			cycleType:
				dto.type === ApplyCouponType.PERIODIC ? dto.cycleType : undefined,
			expireAt: new Date(dto.startTime + coupon.applyTime),
			startTime: dto.startTime,
			source: dto.source,
		}

		return await this.memberModel.updateOne(
			{ _id: { $in: dto.memberIds } },
			{ $push: { coupons: appliedCoupon } }
		)
	}

	async getAllOfOne(memberId: string) {
		const member = await this.memberModel
			.findById(memberId)
			.orFail(new NotFoundDataException('Member'))
			.populate<{ 'coupons.coupon': Coupon }>('coupons.coupon')
			.lean({ virtuals: true })
			.exec()
		console.log(member)
		return member.coupons
	}

	async getOne(
		memberId: string,
		appliedCouponId: string
	): Promise<AppliedCoupon> {
		const coupons = (
			await this.memberModel
				.findOne({ _id: memberId, 'coupons.startTime': { $lt: Date.now() } })
				.populate<{ 'coupons.coupon': Coupon }>('coupons.coupon')
				.select('coupons')
				.lean({ virtuals: true })
				.exec()
		).coupons
		return coupons.find(coupon => coupon._id.toString() === appliedCouponId)
	}

	transformForMemberApp(appliedCoupon: AppliedCoupon): CustomOwnCoupon {
		return {
			_id: appliedCoupon._id,
			expireAt: appliedCoupon.expireAt,
			startTime: new Date(appliedCoupon.startTime),
			detail: {
				_id: appliedCoupon.coupon['_id'].toString(),
				code: appliedCoupon.coupon['code'].toString(),
				title: appliedCoupon.coupon['title'].toString(),
				description: appliedCoupon.coupon['description'].toString(),
				image: appliedCoupon.coupon['image'].toString(),
				applyHour: appliedCoupon.coupon['applyHour']?.toString(),
			},
		}
	}
}
