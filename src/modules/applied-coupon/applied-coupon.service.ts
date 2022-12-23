import { PopulatedAppliedCoupon } from './schemas/populate/applied-coupon.populate'
import { NotFoundDataException } from '@/common/exceptions/http'
import { ApplyCouponType, DatabaseConnectionName } from '@/constants'
import { CouponService } from '@/modules/coupon/coupon.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Member, MemberDocument } from '../member/schemas/member.schema'
import { CreateAppliedCouponDto } from './dto/request/create-applied-coupon.dto'
import { AppliedCoupon } from './schemas/applied-coupon.schema'
import { UpdateResult } from 'mongodb'
import { CustomOwnCoupon } from './dto/response/own-coupon.dto'
import { MemberRankService } from '../member-rank/member-rank.service'
import { DataToCreate } from './dto/response/get-data-to-create.dto'

@Injectable()
export class AppliedCouponService {
	constructor(
		@InjectModel(Member.name, DatabaseConnectionName.DATA)
		private readonly memberModel: Model<MemberDocument>,
		private couponService: CouponService,
		private memberRankService: MemberRankService
	) {}

	async getDataToCreate(): Promise<DataToCreate> {
		const [memberRanks, coupons] = await Promise.all([
			this.memberRankService.getAllShortData(),
			this.couponService.getAllShortData(),
		])

		return {
			memberRanks,
			coupons,
		}
	}

	async create(dto: CreateAppliedCouponDto): Promise<UpdateResult> {
		const coupons = await this.couponService.getByListId(dto.couponId)

		dto.startTime = +dto.startTime

		const now = Date.now()

		if (dto.startTime < now) dto.startTime = now

		const appliedCoupon: AppliedCoupon[] = coupons.map(coupon => ({
			coupon: new Types.ObjectId(coupon._id.toString()),
			type: dto.type,
			cycleType:
				dto.type === ApplyCouponType.PERIODIC ? dto.cycleType : undefined,
			expireAt: new Date(dto.startTime + coupon.amountApplyHour * 3600000),
			startTime: dto.startTime,
			source: dto.source,
		}))

		const listIds = dto.applyTo.map(id => new Types.ObjectId(id))

		return await this.memberModel.updateMany(
			{
				$or: [
					{ _id: { $in: listIds } },
					{ 'memberInfo.rank': { $in: listIds } },
				],
			},
			{ $push: { coupons: { $each: appliedCoupon } } }
		)
	}

	async getAllOfOne(memberId: string) {
		const member = await this.memberModel
			.findById(memberId)
			.orFail(new NotFoundDataException('Member'))
			.populate<{ coupons: Array<PopulatedAppliedCoupon> }>('coupons.coupon')
			.lean({ virtuals: true })
			.exec()
		return member.coupons
	}

	async getOne(
		memberId: string,
		appliedCouponId: string
	): Promise<PopulatedAppliedCoupon> {
		const member = await this.memberModel
			.findOne({ _id: memberId })
			.orFail(new NotFoundDataException('Member'))
			.populate<{ coupons: Array<PopulatedAppliedCoupon> }>('coupons.coupon')
			.select('coupons')
			.lean({ virtuals: true })
			.exec()
		const now = Date.now()
		const coupons = member.coupons.filter(
			appliedCoupon =>
				appliedCoupon.startTime <= now && appliedCoupon.expireAt.getTime() > now
		)
		return coupons.find(coupon => coupon._id.toString() === appliedCouponId)
	}

	transformForMemberApp(
		appliedCoupon: AppliedCoupon | PopulatedAppliedCoupon
	): CustomOwnCoupon {
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
