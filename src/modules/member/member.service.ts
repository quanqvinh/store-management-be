import { AppliedCoupon } from '@/modules/applied-coupon/schemas/applied-coupon.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import {
	Member,
	MemberDocument,
	VirtualMemberData,
} from './schemas/member.schema'
import { CreateMemberDto, UpdateMemberInfoDto } from './dto/request'
import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'
import { UpdateResult, DeleteResult } from 'mongodb'
import {
	NotCreatedDataException,
	NotFoundDataException,
} from '@/common/exceptions/http'
import { DatabaseConnectionName } from '@/constants'
import { stringToDate } from '@/utils'
import { MemberRank } from '../member-rank/schemas/member-rank.schema'
import { Coupon } from '../coupon/schemas/coupon.schema'

@Injectable()
export class MemberService {
	constructor(
		@InjectModel(Member.name, DatabaseConnectionName.DATA)
		public memberModel: Model<MemberDocument & VirtualMemberData>
	) {}

	async findAll(): Promise<Member[]> {
		return await this.memberModel.find({ role: Member.name }).lean().exec()
	}

	async findById(id: string): Promise<Member & VirtualMemberData> {
		return await this.memberModel.findById(id).lean({ virtuals: true }).exec()
	}

	async findByEmail(email: string): Promise<Member> {
		return await this.memberModel.findOne({ email }).lean().exec()
	}

	async create(dto: CreateMemberDto, memberRankId: string): Promise<Member> {
		try {
			const code = 'M' + Math.floor(Date.now() / 1000)
			const dob = stringToDate(dto.dob)
			dto.dob = undefined
			return await this.memberModel.create({
				...dto,
				dob,
				memberInfo: { code, rank: memberRankId },
			})
		} catch (err) {
			if (DuplicateKeyException.check(err)) throw new DuplicateKeyException(err)
			throw err
		}
	}

	async updateInfo(
		memberId: string,
		dto: UpdateMemberInfoDto
	): Promise<UpdateResult> {
		try {
			return await this.memberModel
				.updateOne({ _id: memberId, role: Member.name }, dto)
				.exec()
		} catch (err) {
			if (DuplicateKeyException.check(err)) throw new DuplicateKeyException(err)
			throw err
		}
	}

	async delete(memberId: string): Promise<DeleteResult> {
		const existedMember = await this.memberModel
			.findOne({ _id: memberId, role: Member.name })
			.lean()
			.exec()
		if (!existedMember) throw new NotFoundDataException('Member')
		return await this.memberModel
			.deleteOne({ _id: memberId, role: Member.name })
			.exec()
	}

	async getMemberDataInHome(memberId: string) {
		const memberData = await this.memberModel
			.findById(memberId)
			.populate<{ 'memberInfo.rank': MemberRank }>('memberInfo.rank')
			.orFail()
			.select('firstName lastName coupons notifications memberInfo -_id')
			.lean({ virtuals: true })
			.exec()

		const couponCount = memberData.coupons.filter(
			coupon => coupon.startTime < Date.now()
		).length
		const notificationCount = memberData.notifications.length
		return {
			memberData: {
				firstName: memberData.firstName,
				lastName: memberData.lastName,
				fullName: memberData['fullName'],
				memberInfo: memberData.memberInfo,
			},
			couponCount,
			notificationCount,
		}
	}

	async signUpAccount(email: string): Promise<Member | null> {
		const updatedMember = await this.memberModel
			.findOneAndUpdate({ email }, { $unset: { notVerified: 1 } })
			.orFail(new NotCreatedDataException())
			.exec()
		if (!updatedMember) return null
		return updatedMember
	}

	async checkCoupon(
		memberId: string,
		couponId: string
	): Promise<AppliedCoupon> {
		const member = await this.memberModel
			.findById(memberId)
			.orFail(new NotFoundDataException('Member'))
			.populate<{ 'coupons.coupon': Coupon }>('coupons.coupon')
			.select('coupons')
			.lean()
			.exec()
		const coupon = member.coupons.find(appliedCoupon => {
			return appliedCoupon.coupon['_id'].toString() === couponId
		})
		if (!coupon) throw new NotFoundDataException('This own coupon')
		return coupon
	}

	async deleteAppliedCoupon(
		memberId: string,
		couponId: string
	): Promise<UpdateResult> {
		return this.memberModel.updateOne(
			{ _id: memberId },
			{
				$pull: {
					coupons: { coupon: new Types.ObjectId(couponId.toString()) },
				},
			}
		)
	}
}
