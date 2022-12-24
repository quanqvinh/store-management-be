import { InjectModel } from '@nestjs/mongoose'
import { CreatePromotionDto } from './dto/request/create-promotion.dto'
import { Injectable } from '@nestjs/common'
import { Promotion, PromotionDocument } from './schemas/promotion.schema'
import { DatabaseConnectionName } from '@/constants'
import { Model, Types } from 'mongoose'
import { MemberService } from '../member/member.service'
import {
	GetPromotionListAdminFilterDto,
	SortOrder,
} from './dto/request/get-list-for-admin.dto'
import { Status } from '../product/dto/request/get-product-list-admin-filter.dto'
import {
	PopulatedPrivilege,
	PromotionItemAdminDto,
	ShortCoupon,
} from './dto/response/promotion-item-admin.dto'
import { UpdatePromotionDto } from './dto/request/update-promotion.đto'
import {
	NotFoundDataException,
	NotModifiedDataException,
} from '@/common/exceptions/http'
import {
	PromotionActionTimer,
	PromotionActionTimerDocument,
} from './schemas/promotion-action-timer.schema'
import { MemberRankService } from '../member-rank/member-rank.service'
import { GetRelationDataDto } from './dto/response/get-relation-data.dto'

@Injectable()
export class PromotionService {
	constructor(
		@InjectModel(Promotion.name, DatabaseConnectionName.DATA)
		private readonly promotionModel: Model<PromotionDocument>,
		@InjectModel(PromotionActionTimer.name, DatabaseConnectionName.DATA)
		private readonly promotionActionTimerModel: Model<PromotionActionTimerDocument>,
		private memberService: MemberService,
		private memberRankService: MemberRankService
	) {}

	async getRelationData(): Promise<GetRelationDataDto> {
		const memberRanks = await this.memberRankService.getAllShortData()
		return {
			memberRanks,
		}
	}

	async create(data: CreatePromotionDto) {
		return await this.promotionModel.create({
			...data,
			coupon: new Types.ObjectId(data.coupon + ''),
		})
	}

	async getDetail(id: string) {
		return await this.promotionModel.findById(id).lean().exec()
	}

	async getAllForMember(memberId: string) {
		const memberInfo = (await this.memberService.findById(memberId)).memberInfo
		const promotions = await this.promotionModel
			.aggregate([
				{
					$match: {
						deleted: false,
						opening: true,
						ignoreMembers: { $ne: new Types.ObjectId(memberId) },
						'privilege.applyTo': memberInfo.rank,
					},
				},
				{
					$project: {
						opening: 0,
						deleted: 0,
						createdAt: 0,
						updatedAt: 0,
					},
				},
				{
					$unwind: '$privilege',
				},
				{
					$match: {
						'privilege.applyTo': memberInfo.rank,
					},
				},
				{
					$replaceRoot: {
						newRoot: { $mergeObjects: ['$privilege', '$$ROOT'] },
					},
				},
				{
					$project: {
						applyTo: 0,
						privilege: 0,
					},
				},
				{
					$match: {
						$or: [{ $expr: { $lt: ['$sold', '$limit'] } }, { limit: 0 }],
					},
				},
				{
					$addFields: {
						limit: {
							$ifNull: ['$limit', 0],
						},
					},
				},
			])
			.exec()
		return promotions
	}

	async getAllForAdmin(
		query: GetPromotionListAdminFilterDto
	): Promise<PromotionItemAdminDto[]> {
		const [sortBy, sortOrder] = [
			query.sortBy ?? 'name',
			query.sortOrder === SortOrder.DESC ? '-' : '',
		]

		const filter = {
			...(query.keyword ? { $text: { $search: query.keyword } } : {}),
			...(query.status === Status.DISABLED
				? { deleted: true }
				: query.status === Status.ENABLE
				? { deleted: false }
				: {}),
		}

		const promotions = await this.promotionModel
			.find(filter)
			.populate<{ coupon: ShortCoupon }>({
				path: 'coupon',
				select: 'title code',
			})
			.populate<{ privilege: PopulatedPrivilege[] }>({
				path: 'privilege.applyTo',
				select: 'name display',
			})
			.select([
				'title',
				'cost',
				'opening',
				'deleted',
				'deletedAt',
				'coupon',
				'privilege',
			])
			.sort(sortOrder + sortBy)
			.lean()
			.exec()

		return promotions.map(promotion => {
			const { privilege, ...others } = promotion
			return {
				...others,
				applyTo: privilege.map(value => ({
					_id: value.applyTo._id,
					name: value.applyTo.name,
					display: value.applyTo.display,
					sold: value.sold,
					limit: value.limit,
				})),
			}
		})
	}

	async update(id: string, body: UpdatePromotionDto) {
		for (const key in body) {
			if (body[key]) continue
			delete body[key]
		}

		const updateResult = await this.promotionModel
			.updateOne(
				{ _id: id },
				{
					...body,
				}
			)
			.exec()
		return updateResult.matchedCount === 1
	}

	async disable(id: string, isFlag = false): Promise<boolean> {
		const updateResult = await this.promotionModel
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
		await this.promotionModel
			.findOne({ _id: couponId })
			.orFail(new NotFoundDataException('promotion'))
			.exec()
		const flagId = new Types.ObjectId()
		const [flag, couponUpdateStatus] = await Promise.all([
			this.promotionActionTimerModel.create({
				_id: flagId,
				expireAt: timer,
			}),
			this.promotionModel
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
		const updateResult = await this.promotionModel
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
}
