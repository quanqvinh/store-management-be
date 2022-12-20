import { GetStoreListAdminFilterDto } from './dto/request/get-list-store-admin-filter.dto'
import { FileService } from './../file/services/file.service'
import { CreateStoreDto } from './dto/request/create-store.dto'
import { DatabaseConnectionName } from '@/constants'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Store, StoreDocument, VirtualOrderData } from './schemas/store.schema'
import { File } from '@/types'
import {
	InvalidDataException,
	NotFoundDataException,
	NotModifiedDataException,
} from '@/common/exceptions/http'
import { UpdateStoreInfoDto } from './dto/request/update-store-info.dto'
import {
	StoreActionTimer,
	StoreActionTimerDocument,
} from './schemas/store-action-timer.schema'
import { Order, OrderDocument } from '../order/schemas'
import { weekAnalyticPipeline } from '@/utils/week-analytic-pipeline'
import { SortOrder } from './dto/request/get-list-store-admin-filter.dto'
import { Product, ProductDocument } from '../product/schemas/product.schema'
import { StoreDetailForAdminDto } from './dto/response/store-detail-admin-app.dto'
import {
	StoreItemForAdminDto,
	StoreSaleData,
} from './dto/response/store-sale.dto'

@Injectable()
export class StoreService {
	constructor(
		@InjectModel(Store.name, DatabaseConnectionName.DATA)
		private readonly storeModel: Model<StoreDocument>,
		@InjectModel(StoreActionTimer.name, DatabaseConnectionName.DATA)
		private readonly storeActionTimerModel: Model<StoreActionTimerDocument>,
		@InjectModel(Order.name, DatabaseConnectionName.DATA)
		private readonly orderModel: Model<OrderDocument>,
		@InjectModel(Product.name, DatabaseConnectionName.DATA)
		private readonly productModel: Model<ProductDocument>,
		private fileService: FileService
	) {}

	async getAllForMember(): Promise<Store[]> {
		return await this.storeModel
			.find()
			.select('mainImage fullAddress images dailyTime address')
			.lean({ virtuals: true })
	}

	async getAllForAdmin(
		query: GetStoreListAdminFilterDto
	): Promise<StoreItemForAdminDto[]> {
		const [sortBy, sortOrder] = [
			query.sortBy ?? 'name',
			query.sortOrder === SortOrder.DESC ? '-' : '',
		]

		const filter = {
			...(query.keyword ? { $text: { $search: query.keyword } } : {}),
		}

		const [stores, storesSale] = await Promise.all([
			this.storeModel
				.find(filter)
				.select('images mainImage fullAddress name address updatedAt')
				.sort(sortOrder + sortBy)
				.lean({ virtuals: true })
				.exec(),
			this.orderModel.aggregate<StoreSaleData>([
				...weekAnalyticPipeline(),
				{
					$unwind: '$items',
				},
				{
					$group: {
						_id: '$_id',
						totalAmount: {
							$sum: '$items.amount',
						},
						totalPrice: {
							$first: '$totalPrice',
						},
						store: {
							$first: '$store.id',
						},
						week: {
							$first: '$week',
						},
					},
				},
				{
					$group: {
						_id: {
							store: '$store',
							week: '$week',
						},
						totalAmount: {
							$sum: '$totalAmount',
						},
						totalPrice: {
							$sum: '$totalPrice',
						},
					},
				},
				{
					$match: {
						'_id.week': {
							$gte: 0,
						},
					},
				},
				{
					$addFields: {
						weekOne: {
							$cond: {
								if: {
									$eq: ['$_id.week', 0],
								},
								then: {
									totalAmount: '$totalAmount',
									totalPrice: '$totalPrice',
								},
								else: {
									totalAmount: 0,
									totalPrice: 0,
								},
							},
						},
						weekTwo: {
							$cond: {
								if: {
									$eq: ['$_id.week', 1],
								},
								then: {
									totalAmount: '$totalAmount',
									totalPrice: '$totalPrice',
								},
								else: {
									totalAmount: 0,
									totalPrice: 0,
								},
							},
						},
					},
				},
				{
					$group: {
						_id: '$_id.store',
						weekOne_totalAmount: {
							$sum: '$weekOne.totalAmount',
						},
						weekTwo_totalAmount: {
							$sum: '$weekTwo.totalAmount',
						},
						weekOne_totalPrice: {
							$sum: '$weekOne.totalPrice',
						},
						weekTwo_totalPrice: {
							$sum: '$weekTwo.totalPrice',
						},
					},
				},
				{
					$project: {
						_id: 1,
						weekOne: {
							totalAmount: '$weekOne_totalAmount',
							totalPrice: '$weekOne_totalPrice',
						},
						weekTwo: {
							totalAmount: '$weekTwo_totalAmount',
							totalPrice: '$weekTwo_totalPrice',
						},
					},
				},
			]),
		])
		const storeSaleMap = storesSale.reduce((res, store) => {
			return Object.assign(res, {
				[store._id]: {
					saleAmountOfWeek: store.weekOne.totalAmount,
					changeAmountOfWeek:
						store.weekOne.totalAmount - store.weekTwo.totalAmount,
					salePriceOfWeek: store.weekOne.totalPrice,
					changePriceOfWeek:
						store.weekOne.totalPrice - store.weekTwo.totalAmount,
				},
			})
		}, {})
		return stores.map(store => ({
			_id: store._id,
			mainImage: store['mainImage'],
			fullAddress: store['fullAddress'],
			name: store.name,
			updatedAt: store.updatedAt,
			sale: storeSaleMap[store._id.toString()]
				? storeSaleMap[store._id.toString()]
				: {
						saleAmountOfWeek: 0,
						changeAmountOfWeek: 0,
						salePriceOfWeek: 0,
						changePriceOfWeek: 0,
				  },
		}))
	}

	async getDetailForAdmin(storeId: string): Promise<StoreDetailForAdminDto> {
		const storeDetail = await this.storeModel.findById(storeId).lean().exec()
		const allProductsInShort = await this.productModel
			.find()
			.select('name images mainImage originalPrice')
			.lean({ virtuals: ['mainImage'] })
			.exec()
		return {
			storeDetail: storeDetail as Store,
			allProductsInShort: allProductsInShort.map(product => {
				delete product.images
				return product
			}),
		}
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

	async updateStoreInfo(storeId: string, dto: UpdateStoreInfoDto) {
		Object.keys(dto).forEach(key => {
			const value = dto[key]
			if (!value) {
				delete dto[key]
			} else if (typeof value === 'object' && Object.keys(value).length === 0) {
				delete dto[key]
			}
		})
		if (dto.dailyTime) {
			if (dto.dailyTime.open.hour > dto.dailyTime.close.hour) {
				throw new BadRequestException('Opening time is invalid')
			} else if (
				dto.dailyTime.open.hour === dto.dailyTime.close.hour &&
				dto.dailyTime.open.minute >= dto.dailyTime.close.minute
			) {
				throw new BadRequestException('Opening time is invalid')
			}
		}
		const updateResult = await this.storeModel
			.updateOne(
				{ _id: storeId },
				{
					...dto,
				}
			)
			.orFail(new NotModifiedDataException())
			.exec()
		return updateResult.modifiedCount === 1
	}

	async updateStoreImage(
		storeId: string,
		newImages: Array<string>,
		deletedImages: Array<string>
	) {
		const store = await this.storeModel
			.findById(storeId)
			.orFail(new NotFoundDataException('store'))
			.select('images')
			.lean()
			.exec()
		deletedImages = deletedImages.filter(image => store.images.includes(image))
		const images = store.images
			.filter(image => !deletedImages.includes(image))
			.concat(newImages)
		const [deleteImageResult, updateStatus] = await Promise.all([
			this.fileService.deleteMany(deletedImages),
			this.storeModel.updateOne(
				{ _id: storeId },
				{
					images,
				}
			),
		])
		return deleteImageResult && updateStatus.modifiedCount === 1
	}

	async disable(id: string, isFlag = false): Promise<boolean> {
		const updateResult = await this.storeModel
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

	async addDisableFlag(storeId: string, timer: number) {
		await this.storeModel
			.findOne({ _id: storeId })
			.orFail(new NotFoundDataException('store'))
			.exec()
		const flagId = new Types.ObjectId()
		const [flag, storeUpdateStatus] = await Promise.all([
			this.storeActionTimerModel.create({
				_id: flagId,
				expireAt: timer,
			}),
			this.storeModel
				.updateOne(
					{ _id: storeId },
					{
						disableFlag: flagId,
					}
				)
				.orFail(new NotModifiedDataException())
				.exec(),
		])
		return !!flag && storeUpdateStatus.modifiedCount === 1
	}

	async enable(storeId: string) {
		console.log(storeId)
		const updateResult = await this.storeModel
			.updateOne(
				{ _id: new Types.ObjectId(storeId) },
				{
					deleted: false,
					$unset: { deletedAt: 1 },
				}
			)
			.orFail(new NotModifiedDataException())
			.exec()
		console.log(updateResult)
		return updateResult.modifiedCount === 1
	}

	async destroy(storeId: string) {
		const store = await this.storeModel.findOne({ _id: storeId }).lean().exec()
		if (!store.deleted) {
			throw new BadRequestException(
				'Cannot destroy store, need to disable first'
			)
		}
		const result = await this.storeModel
			.deleteOne({ _id: storeId })
			.lean()
			.exec()
		return result.deletedCount === 1
	}
}
