import { NotFoundDataException } from '@/common/exceptions/http'
import {
	StoreActionTimer,
	StoreActionTimerDocument,
} from './../schemas/store-action-timer.schema'
import { DatabaseConnectionName } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Store, StoreDocument } from '../schemas/store.schema'
import { ChangeStreamDocument } from 'mongodb'
import { StoreService } from '../store.service'

@Injectable()
export class StoreStream {
	constructor(
		@InjectModel(Store.name, DatabaseConnectionName.DATA)
		private readonly storeModel: Model<StoreDocument>,
		@InjectModel(StoreActionTimer.name, DatabaseConnectionName.DATA)
		private readonly storeActionTimerModel: Model<StoreActionTimerDocument>,
		private storeService: StoreService
	) {
		this.watchStream()
	}

	private watchStream() {
		this.storeActionTimerModel
			.watch()
			.on('change', async (data: ChangeStreamDocument) => {
				if (data.operationType === 'delete') {
					const disableStatus = await this.storeService.disable(
						data.documentKey._id?.toString(),
						true
					)
					if (disableStatus) {
						console.log('Disable store successful!')
					} else {
						console.log('Disable store failed!')
					}
				}
			})
	}
}
