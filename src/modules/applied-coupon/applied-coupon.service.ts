import { NotFoundDataException } from '@/common/exceptions/http'
import { ApplyCouponType, DatabaseConnectionName } from '@/constants'
import { CouponService } from '@/modules/coupon/coupon.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Member, MemberDocument } from '../member/schemas/member.schema'
import { CreateAppliedCouponDto } from './dto/create-applied-coupon.dto'
import {
	AppliedCoupon,
	AppliedCouponDocument,
} from './schemas/applied-coupon.schema'
import { UpdateResult } from 'mongodb'
import { Coupon } from '../coupon/schemas/coupon.schema'

@Injectable()
export class AppliedCouponService {
	constructor(
		@InjectModel(AppliedCoupon.name, DatabaseConnectionName.DATA)
		private readonly appliedCouponModel: Model<AppliedCouponDocument>,
		@InjectModel(Member.name, DatabaseConnectionName.DATA)
		private readonly memberModel: Model<MemberDocument>,
		private couponService: CouponService
	) {}

	async create(dto: CreateAppliedCouponDto): Promise<UpdateResult> {
		const coupon = await this.couponService.getById(dto.couponId)

		dto.startTime = +dto.startTime

		if (dto.startTime === 0) dto.startTime = Date.now()

		const appliedCoupon = new this.appliedCouponModel({
			coupon: dto.couponId,
			type: dto.type,
			cycleType:
				dto.type === ApplyCouponType.PERIODIC ? dto.cycleType : undefined,
			expireAt: new Date(dto.startTime + coupon.applyTime),
			startTime: dto.startTime,
			source: dto.source,
		})

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
		return member.coupons
	}

	async getOne(memberId: string, couponId: string): Promise<AppliedCoupon> {
		const coupons = (
			await this.memberModel
				.findOne({ _id: memberId, startTime: { $lt: Date.now() } })
				.lean({ virtuals: true })
				.exec()
		).coupons
		return coupons.find(coupon => coupon._id.toString() === couponId)
	}
}
