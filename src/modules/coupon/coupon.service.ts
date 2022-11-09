import { UpdateNotificationCouponDto } from './dto/update-notification-coupon.dto'
import { UpdateInfoCouponDto } from './dto/update-info-coupon.dto'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { DatabaseConnectionName } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Coupon, CouponDocument } from './schemas/coupon.schema'
import { UpdateResult } from 'mongodb'
import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'

@Injectable()
export class CouponService {
	constructor(
		@InjectModel(Coupon.name, DatabaseConnectionName.DATA)
		private readonly couponModel: Model<CouponDocument>
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
		dto: UpdateNotificationCouponDto
	): Promise<UpdateResult>
	// Implementation signature
	async update(
		id: string,
		dto: UpdateInfoCouponDto | UpdateNotificationCouponDto
	): Promise<UpdateResult> {
		return await this.couponModel
			.updateOne({ _id: id }, { $set: { ...dto } })
			.exec()
	}
}
