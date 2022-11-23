import { CreateStoreDto } from './dto/create-store.dto'
import { DatabaseConnectionName } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Store, StoreDocument, VirtualOrderData } from './schemas/store.schema'
import { File } from '@/types'
import {
	InvalidDataException,
	NotFoundDataException,
} from '@/common/exceptions/http'

@Injectable()
export class StoreService {
	constructor(
		@InjectModel(Store.name, DatabaseConnectionName.DATA)
		private readonly storeModel: Model<StoreDocument>
	) {}

	async getAllForMember(): Promise<Store[]> {
		return await this.storeModel
			.find()
			.select('mainImage fullAddress images dailyTime address')
			.lean({ virtuals: true })
	}

	async getUnavailableProductsOfStore({
		id,
		slug,
	}: {
		id?: string
		slug?: string
	}): Promise<Types.ObjectId[]> {
		if (!id && !slug) throw new InvalidDataException('ID or slug')

		const store = await this.storeModel
			.findOne({ $or: [{ slug }, { _id: id }] })
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

	async getOne(
		{ id, slug }: { id?: string; slug?: string },
		select = ''
	): Promise<Partial<Store & VirtualOrderData>> {
		const store = await this.storeModel
			.findOne({ $or: [{ _id: id }, { slug }] })
			.orFail(new NotFoundDataException('Store'))
			.lean({ virtuals: true })
			.exec()
		const result = {}
		select
			.split(' ')
			.forEach(field => Object.assign(result, { [field]: store[field] }))
		return result
	}
}
