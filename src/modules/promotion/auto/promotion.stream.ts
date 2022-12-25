import { DatabaseConnectionName } from '@/constants'
import { Member, MemberDocument } from '@/modules/member/schemas/member.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Promotion, PromotionDocument } from '../schemas/promotion.schema'
import {
	PromotionActionTimer,
	PromotionActionTimerDocument,
} from '../schemas/promotion-action-timer.schema'
import { PromotionService } from '../promotion.service'
import { ChangeStreamDocument } from 'mongodb'

@Injectable()
export class PromotionStream {
	constructor(
		@InjectModel(Promotion.name, DatabaseConnectionName.DATA)
		private readonly promotionModel: Model<PromotionDocument>,
		@InjectModel(PromotionActionTimer.name, DatabaseConnectionName.DATA)
		private readonly promotionActionTimerModel: Model<PromotionActionTimerDocument>,
		@InjectModel(Member.name, DatabaseConnectionName.DATA)
		private readonly memberModel: Model<MemberDocument>,
		private promotionService: PromotionService
	) {
		this.watchStream()
	}

	private watchStream() {
		this.promotionActionTimerModel
			.watch()
			.on('change', async (data: ChangeStreamDocument) => {
				if (data.operationType === 'delete') {
					const disableStatus = await this.promotionService.disable(
						data.documentKey._id?.toString(),
						true
					)
					if (disableStatus) {
						console.log('Disable promotion successful!')
					} else {
						console.log('Disable promotion failed!')
					}
				}
			})
	}
}
