import { CreateStoreDto } from './dto/create-store.dto'
import { DatabaseConnectionName } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Callback, Model, Document, ObjectId } from 'mongoose'
import { Store, StoreDocument } from './schemas/store.schema'
import { File } from '@/types'

@Injectable()
export class StoreService {
	constructor(
		@InjectModel(Store.name, DatabaseConnectionName.DATA)
		private readonly storeModel: Model<StoreDocument>
	) {}

	async getAllForMember() {
		return await this.storeModel
			.find()
			.select('addressName mainImage images dailyTime address')
			.lean({ virtuals: true })
	}

	async create(storeData: CreateStoreDto, storeImages: Array<File>) {
		return await this.storeModel.create({
			name: storeData.name,
			images: storeImages.map(image => image.id),
			dailyTime: storeData.dailyTime,
			address: storeData.address,
		})
	}
}
