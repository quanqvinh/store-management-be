import { DataNotChangeException } from '@/common/exceptions/http'
import { MemberOrder } from './../schemas/discriminators/member-order.schema'
import { Buyer, DatabaseConnectionName, OrderStatus } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
	ChangeStreamDocument,
	ChangeStreamUpdateDocument,
	ObjectId,
} from 'mongodb'
import { MemberOrderDocument, Order, OrderDocument } from '../schemas'
import { Member, MemberDocument } from '@/modules/member/schemas/member.schema'

@Injectable()
export class OrderStream {
	constructor(
		@InjectModel(Order.name, DatabaseConnectionName.DATA)
		private readonly orderModel: Model<OrderDocument>,
		@InjectModel(Buyer.MEMBER, DatabaseConnectionName.DATA)
		private readonly memberOrderModel: Model<MemberOrderDocument>,
		@InjectModel(Member.name, DatabaseConnectionName.DATA)
		private readonly memberModel: Model<MemberDocument>
	) {
		this.watchStream()
	}

	private watchStream() {
		this.orderModel.watch().on('change', async (data: ChangeStreamDocument) => {
			if (data.operationType === 'update') {
				const updateStream = data as ChangeStreamUpdateDocument<OrderDocument>
				const updatedFields = updateStream.updateDescription.updatedFields
				if (updatedFields?.status) {
					if (updatedFields.status === OrderStatus.DONE)
						await this.accumulatePointMember(updateStream.documentKey._id)
				}
			}
		})
	}

	async accumulatePointMember(orderId: ObjectId) {
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
}
