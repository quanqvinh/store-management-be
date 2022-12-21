import { CreateAppliedCouponDto } from './../../applied-coupon/dto/request/create-applied-coupon.dto'
import { AppliedCouponService } from './../../applied-coupon/applied-coupon.service'
import {
	DataNotChangeException,
	NotFoundDataException,
} from '@/common/exceptions/http'
import { MemberOrder } from './../schemas/discriminators/member-order.schema'
import {
	ApplyCouponType,
	Buyer,
	CouponSource,
	DatabaseConnectionName,
	OrderStatus,
} from '@/constants'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Schema } from 'mongoose'
import {
	ChangeStreamDocument,
	ChangeStreamUpdateDocument,
	ObjectId,
} from 'mongodb'
import { MemberOrderDocument, Order, OrderDocument } from '../schemas'
import { Member, MemberDocument } from '@/modules/member/schemas/member.schema'
import { PopulatedMemberInfo } from '@/modules/member/schemas/populate/member.populate'
import { MemberRankService } from '@/modules/member-rank/member-rank.service'
import { MemberRank } from '@/modules/member-rank/schemas/member-rank.schema'

@Injectable()
export class OrderStream {
	constructor(
		@InjectModel(Order.name, DatabaseConnectionName.DATA)
		private readonly orderModel: Model<OrderDocument>,
		@InjectModel(Buyer.MEMBER, DatabaseConnectionName.DATA)
		private readonly memberOrderModel: Model<MemberOrderDocument>,
		@InjectModel(Member.name, DatabaseConnectionName.DATA)
		private readonly memberModel: Model<MemberDocument>,
		private memberRankService: MemberRankService,
		private appliedCouponService: AppliedCouponService
	) {
		this.watchStream()
	}

	private watchStream() {
		this.orderModel.watch().on('change', async (data: ChangeStreamDocument) => {
			if (data.operationType === 'update') {
				const updateStream = data as ChangeStreamUpdateDocument<OrderDocument>
				const updatedFields = updateStream.updateDescription.updatedFields
				if (this.isUpdateStatus(updatedFields)) {
					if (
						await this.isDoneOrder(updatedFields, updateStream.documentKey._id)
					) {
						await this.accumulatePointMember(updateStream.documentKey._id)
					}
				}
			} else if (data.operationType === 'insert') {
				if ((data.fullDocument as MemberOrder)?.member.id) {
					const insertedData = data.fullDocument as MemberOrder
					await this.updateMemberPoint(
						insertedData.member.id,
						insertedData.earnedPoint
					)
				}
			}
		})
	}

	private isUpdateStatus(updatedFields: Record<string, any>) {
		return Object.keys(updatedFields).some(fieldName => {
			return fieldName.match(new RegExp(/^status.[0-9]+.checked$/))
		})
	}

	private async isDoneOrder(status: Record<string, any>, orderId: ObjectId) {
		const { status: orderStatus } = await this.memberOrderModel
			.findById(orderId)
			.select('status')
			.lean()
			.exec()
		const statusIndex = +Object.keys(status)
			.find(key => key.match(new RegExp(/^status.[0-9]+.checked$/)))
			.split('.')[1]
		return (
			orderStatus[statusIndex].status === OrderStatus.DONE &&
			orderStatus[statusIndex].checked
		)
	}

	private async accumulatePointMember(orderId: ObjectId) {
		const order = await this.orderModel
			.findById(orderId)
			.select('buyer member.id totalPrice earnedPoint')
			.lean()
			.exec()
		if (order.buyer !== Buyer.MEMBER) return

		const memberOrder = order as unknown as MemberOrder

		if (memberOrder.earnedPoint === 0) return

		const updateStatus = await this.memberModel
			.updateOne(
				{
					_id: memberOrder.member.id,
				},
				{
					$inc: { 'memberInfo.currentPoint': memberOrder.earnedPoint },
				}
			)
			.orFail(new DataNotChangeException('member'))
			.exec()
		if (updateStatus.modifiedCount) console.log('Accumulate point successful')
		else console.log('Accumulate point failed')
	}

	private async updateMemberPoint(
		memberId: Schema.Types.ObjectId,
		point: number
	) {
		const { memberInfo } = await this.memberModel
			.findById(memberId)
			.orFail(new NotFoundDataException('member'))
			.select('memberInfo')
			.populate<{ memberInfo: PopulatedMemberInfo }>('memberInfo.rank')
			.lean({ virtuals: true })
			.exec()
		const totalPoint = memberInfo.totalPoint + point
		let currentRank: Schema.Types.ObjectId

		try {
			const nextRank = await this.memberRankService.getOne({
				rank: memberInfo.rank.rank + 1,
			})
			if (totalPoint >= nextRank.condition) {
				currentRank = nextRank._id
				this.rankUpMember(memberId, nextRank)
			}
		} catch {
			currentRank = memberInfo.rank._id
		}

		const updatedMember = await this.memberModel.updateOne(
			{ _id: memberId },
			{
				'memberInfo.currentPoint': memberInfo.currentPoint + point,
				'memberInfo.rank': currentRank,
			}
		)

		if (updatedMember) {
			Logger.verbose(
				`Accumulate ${point} points to ${memberId} successful`,
				'OrderStream'
			)
		} else {
			Logger.verbose(`Accumulate point to ${memberId} failed`, 'OrderStream')
		}
	}

	private async rankUpMember(
		memberId: Schema.Types.ObjectId,
		rank: MemberRank
	) {
		const dto: CreateAppliedCouponDto = {
			applyTo: [memberId.toString()],
			couponId: rank.coupons.map(coupon => coupon.toString()),
			type: ApplyCouponType.ONCE,
			source: CouponSource.GIFT,
			startTime: 0,
		}
		const updateResult = await this.appliedCouponService.create(dto)
		if (updateResult.modifiedCount) {
			const numberCoupon = rank.coupons.length
			Logger.verbose(
				`Send ${numberCoupon} gift${numberCoupon > 1 ? 's' : ''} of rank ${
					rank.name
				} to member ${memberId} successful`,
				'OrderStream'
			)
		} else {
			Logger.verbose(
				`Send gift of rank ${rank.name} to member ${memberId} failed`,
				'OrderStream'
			)
		}
	}
}
