import {
	AppliedCouponActionTimer,
	AppliedCouponActionTimerDocument,
} from './../schemas/applied-coupon-action-timer.schema'
import { DatabaseConnectionName } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import {
	AppliedCoupon,
	AppliedCouponDocument,
} from '../schemas/applied-coupon.schema'
import { ChangeStreamDocument } from 'mongodb'
import { Member, MemberDocument } from '@/modules/member/schemas/member.schema'
import { UpdateResult } from 'mongodb'

@Injectable()
export class AppliedCouponStream {
	constructor(
		@InjectModel(AppliedCouponActionTimer.name, DatabaseConnectionName.DATA)
		private readonly appliedCouponActionTimerModel: Model<AppliedCouponActionTimerDocument>,
		@InjectModel(Member.name, DatabaseConnectionName.DATA)
		private readonly memberModel: Model<MemberDocument>
	) {
		this.watchStream()
	}

	private watchStream() {
		this.appliedCouponActionTimerModel
			.watch()
			.on('change', async (data: ChangeStreamDocument) => {
				if (data.operationType === 'delete') {
					const result = await this.deleteAppliedCoupon(
						data.documentKey._id?.toString()
					)
					console.log(
						`Deleted ${result.modifiedCount}/${result.matchedCount} applied coupon`
					)
				}
			})
	}

	private async deleteAppliedCoupon(flagId: string): Promise<UpdateResult> {
		const updateResult = await this.memberModel.updateMany(
			{
				'coupons.expireFlagId': new Types.ObjectId(flagId),
			},
			{
				$pull: { coupons: { expireFlagId: new Types.ObjectId(flagId) } },
			}
		)
		return updateResult
	}
}
