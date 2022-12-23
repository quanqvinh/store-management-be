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

@Injectable()
export class PromotionService {
	constructor(
		@InjectModel(Promotion.name, DatabaseConnectionName.DATA)
		private readonly promotionModel: Model<PromotionDocument>,
		private memberService: MemberService
	) {}

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

	async update() {}

	async disable() {}

	async enable() {}
}
