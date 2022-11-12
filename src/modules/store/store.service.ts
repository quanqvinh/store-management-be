import { NotFoundDataException } from './../../common/exceptions/http/not-found.exception'
import { CreateStoreDto } from './dto/create-store.dto'
import { DatabaseConnectionName } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Store, StoreDocument } from './schemas/store.schema'
import { File } from '@/types'

@Injectable()
export class StoreService {
	constructor(
		@InjectModel(Store.name, DatabaseConnectionName.DATA)
		private readonly storeModel: Model<StoreDocument>
	) {}

	async getAllForMember(): Promise<Store[]> {
		return await this.storeModel
			.find()
			.select('addressName mainImage images dailyTime address')
			.lean({ virtuals: true })
	}

	async getUnavailableProductsOfStore(
		storeId: string
	): Promise<Types.ObjectId[]> {
		const store = await this.storeModel
			.findById(storeId)
			.orFail(new NotFoundDataException('Store'))
			.select('unavailableProducts')
			.lean()
			.exec()
		return store.unavailableProducts.map(
			id => new Types.ObjectId(id.toString())
		)
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
