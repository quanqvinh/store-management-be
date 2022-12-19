import {
	CouponActionTimer,
	CouponActionTimerDocument,
} from './schemas/coupon-action-timer.schema'
import {
	GetCouponListAdminFilterDto,
	SortOrder,
} from './dto/request/get-coupon-for-admin.dto'
import { UpdateInfoCouponDto } from './dto/request/update-info-coupon.dto'
import { CreateCouponDto } from './dto/request/create-coupon.dto'
import { DatabaseConnectionName } from '@/constants'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Coupon, CouponDocument } from './schemas/coupon.schema'
import { UpdateResult } from 'mongodb'
import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'
import { Order, OrderDocument } from '../order/schemas'
import { CouponItemForAdmin } from './dto/response/coupon-item-for-admin.dto'
import {
	NotFoundDataException,
	NotModifiedDataException,
} from '@/common/exceptions/http'
import { Member, MemberDocument } from '../member/schemas/member.schema'

@Injectable()
export class CouponService {
	constructor(
		@InjectModel(Coupon.name, DatabaseConnectionName.DATA)
		private readonly couponModel: Model<CouponDocument>,
		@InjectModel(Order.name, DatabaseConnectionName.DATA)
		private readonly orderModel: Model<OrderDocument>,
		@InjectModel(Member.name, DatabaseConnectionName.DATA)
		private readonly memberModel: Model<MemberDocument>,
		@InjectModel(CouponActionTimer.name, DatabaseConnectionName.DATA)
		private readonly couponActionTimerModel: Model<CouponActionTimerDocument>
	) {}

	async getAll(): Promise<Coupon[]> {
		return await this.couponModel.find().lean().exec()
	}

	async getById(id: string): Promise<Coupon> {
		return await this.couponModel.findById(id).lean().exec()
	}

	async checkExist(id: string): Promise<boolean> {
		const count = await this.couponModel
			.countDocuments({ _id: id })
			.lean()
			.exec()
		return count === 1
	}

	async create(dto: CreateCouponDto, imageId?: string): Promise<Coupon> {
		try {
			return await this.couponModel.create({
				...dto,
				image: imageId,
			})
		} catch (err) {
			if (DuplicateKeyException.check(err)) throw new DuplicateKeyException(err)
			throw err
		}
	}

	// Update info overload signature
	async update(id: string, dto: UpdateInfoCouponDto): Promise<UpdateResult>
	// Update notification overload signature
	async update(
		id: string,
		dto: Pick<Coupon, 'notification'>
	): Promise<UpdateResult>
	// Implementation signature
	async update(
		id: string,
		dto: UpdateInfoCouponDto | Pick<Coupon, 'notification'>
	): Promise<UpdateResult> {
		return await this.couponModel
			.updateOne({ _id: id }, { $set: { ...dto } })
			.exec()
	}

	async getListForAdmin(
		query: GetCouponListAdminFilterDto
	): Promise<CouponItemForAdmin[]> {
		const [sortBy, sortOrder] = [
			query.sortBy ?? 'name',
			query.sortOrder === SortOrder.DESC ? '-' : '',
		]

		const filter = {
			...(query.keyword ? { $text: { $search: query.keyword } } : {}),
		}

		type CouponWithUsedTime = Pick<CouponItemForAdmin, 'code' | 'usedTime'>
		type CouponOwnedAmount = {
			_id: Types.ObjectId
			ownedAmount: number
		}

		const [coupons, couponUsedTime, couponOwnedAmount] = await Promise.all([
			this.couponModel
				.find(filter)
				.select([
					'-orderCondition',
					'-discount',
					'-description',
					'-notification',
					'-applyHour',
				])
				.sort(sortOrder + sortBy)
				.lean()
				.exec(),
			this.orderModel
				.aggregate<CouponWithUsedTime>([
					{
						$match: {
							coupon: {
								$exists: true,
								$ne: null,
							},
						},
					},
					{
						$group: {
							_id: '$coupon.code',
							usedTime: {
								$sum: 1,
							},
						},
					},
					{
						$project: {
							_id: 0,
							code: '$_id',
							usedTime: 1,
						},
					},
				])
				.exec(),
			this.memberModel
				.aggregate<CouponOwnedAmount>([
					{
						$unwind: '$coupons',
					},
					{
						$group: {
							_id: '$coupons.coupon',
							ownedAmount: {
								$sum: 1,
							},
						},
					},
				])
				.exec(),
		])

		const defaultUsedTime: Omit<CouponWithUsedTime, 'code'> = {
			usedTime: 0,
		}
		const defaultOwnedAmount: Omit<CouponOwnedAmount, '_id'> = {
			ownedAmount: 0,
		}

		const couponUsedTimeMap = couponUsedTime.reduce((res, coupon) => {
			const { code, ...others } = coupon
			return Object.assign(res, {
				[code]: others,
			})
		}, {})
		const couponOwnedAmountMap = couponOwnedAmount.reduce((res, coupon) => {
			const { _id, ...others } = coupon
			return Object.assign(res, {
				[_id.toString()]: others,
			})
		}, {})

		const res = coupons.map(coupon => ({
			...(coupon as Omit<CouponItemForAdmin, 'usedTime' | 'ownedAmount'>),
			...(couponUsedTimeMap[coupon.code] ?? defaultUsedTime),
			...(couponOwnedAmountMap[coupon._id.toString()] ?? defaultOwnedAmount),
		}))

		return res
	}

	async disable(id: string, isFlag = false): Promise<boolean> {
		const updateResult = await this.couponModel
			.updateOne(
				{
					...(isFlag ? { disableFlag: new Types.ObjectId(id) } : { _id: id }),
				},
				{
					deleted: true,
					deletedAt: new Date(),
					$unset: { disableFlag: 1 },
				}
			)
			.orFail(new NotModifiedDataException())
			.exec()
		return updateResult.modifiedCount === 1
	}

	async addDisableFlag(couponId: string, timer: number) {
		await this.couponModel
			.findOne({ _id: couponId })
			.orFail(new NotFoundDataException('coupon'))
			.exec()
		const flagId = new Types.ObjectId()
		const [flag, couponUpdateStatus] = await Promise.all([
			this.couponActionTimerModel.create({
				_id: flagId,
				expireAt: timer,
			}),
			this.couponModel
				.updateOne(
					{ _id: couponId },
					{
						disableFlag: flagId,
					}
				)
				.orFail(new NotModifiedDataException())
				.exec(),
		])
		return !!flag && couponUpdateStatus.modifiedCount === 1
	}

	async enable(couponId: string): Promise<boolean> {
		const updateResult = await this.couponModel
			.updateOne(
				{ _id: couponId },
				{
					$set: { deleted: false },
					$unset: { deletedAt: 1, disableFlag: 1 },
				}
			)
			.orFail(new NotModifiedDataException())
			.exec()
		return updateResult.modifiedCount === 1
	}

	async destroy(couponId: string) {
		const coupon = await this.couponModel
			.findOne({ _id: couponId })
			.lean()
			.exec()
		if (!coupon.deleted) {
			throw new BadRequestException(
				'Cannot destroy coupon, need to disable first'
			)
		}
		const result = await this.couponModel
			.deleteOne({ _id: couponId })
			.lean()
			.exec()
		return result.deletedCount === 1
	}
}
