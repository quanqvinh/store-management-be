import { CreateProductDto } from './dto/request/create-product.dto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Product, ProductDocument } from './schemas/product.schema'
import { Model, Types } from 'mongoose'
import { DatabaseConnectionName } from '@/constants'
import { Category, CategoryDocument } from '../category/schemas/category.schema'
import { CategoryService } from '../category/category.service'
import { MemberAppService } from '../setting/services/member-app.service'
import { StoreService } from '../store/store.service'
import {
	CustomProduct,
	ProductOfCategoryWithStatusDto,
} from './dto/response/product-member-app.dto'
import {
	ProductInOrders,
	ProductItemForAdmin,
} from './dto/response/product-admin-app.dto'
import { Order } from '../order/schemas'
import {
	GetProductListAdminFilterDto,
	SortOrder,
	Status,
} from './dto/request/get-product-list-admin-filter.dto'
import { UpdateProductInfoDto } from './dto/request/update-product-info.dto'
import { Option } from './schemas/option.schema'
import {
	NotFoundDataException,
	NotModifiedDataException,
} from '@/common/exceptions/http'
import { FileService } from '../file/services/file.service'
import {
	ProductActionTimer,
	ProductActionTimerDocument,
} from './schemas/product-action-timer.schema'
import { weekAnalyticPipeline } from '@/utils/week-analytic-pipeline'

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name, DatabaseConnectionName.DATA)
		private readonly productModel: Model<ProductDocument>,
		@InjectModel(Category.name, DatabaseConnectionName.DATA)
		private readonly categoryModel: Model<CategoryDocument>,
		@InjectModel(Order.name, DatabaseConnectionName.DATA)
		private readonly orderModel: Model<CategoryDocument>,
		@InjectModel(ProductActionTimer.name, DatabaseConnectionName.DATA)
		private readonly productActionTimerModel: Model<ProductActionTimerDocument>,
		private categoryService: CategoryService,
		private memberAppService: MemberAppService,
		private storeService: StoreService,
		private fileService: FileService
	) {}

	async create(
		dto: CreateProductDto,
		imageIds: Array<string> | undefined
	): Promise<Product> {
		const [defaultProductImage, _category] = await Promise.all([
			this.memberAppService.getDefaultImages('product'),
			this.categoryService.getOne({ id: dto.category }),
		])
		const images = imageIds?.length ? imageIds : [defaultProductImage]

		return await this.productModel.create({
			name: dto.name,
			images,
			originalPrice: dto.originalPrice,
			category: dto.category,
			description: dto.description,
			options: {
				size: dto.size,
				topping: dto.topping,
			},
		})
	}

	async getAllOfStoreInMemberApp({
		id,
		slug,
	}: {
		id?: string
		slug?: string
	}): Promise<ProductOfCategoryWithStatusDto> {
		const unavailableProductIds =
			id || slug
				? await this.storeService.getUnavailableProductsOfStore({ id, slug })
				: []

		const [unavailableProducts, productsWithCategory] = await Promise.all([
			this.productModel
				.find({ _id: { $in: unavailableProductIds } })
				.select('-category -createdAt')
				.lean({ virtuals: ['mainImage'] })
				.exec(),
			this.productModel.aggregate([
				{ $match: { _id: { $nin: unavailableProductIds } } },
				{ $group: { _id: '$category', products: { $push: '$$ROOT' } } },
				{
					$lookup: {
						from: 'categories',
						localField: '_id',
						foreignField: '_id',
						as: 'category',
					},
				},
				{ $unwind: '$category' },
				{
					$sort: {
						'category.hot': -1,
						'category.order': 1,
					},
				},
				{
					$project: {
						category: 1,
						products: {
							$map: {
								input: '$products',
								as: 'product',
								in: {
									$mergeObjects: [
										'$$product',
										{ mainImage: { $first: '$$product.images' } },
									],
								},
							},
						},
					},
				},
				{
					$project: {
						_id: 0,
						category: {
							hot: 0,
							type: 0,
							order: 0,
						},
						products: {
							category: 0,
							createdAt: 0,
							updatedAt: 0,
						},
					},
				},
			]),
		])

		return {
			available: productsWithCategory,
			unavailable: unavailableProducts as unknown as CustomProduct[],
		}
	}

	async getForMemberApp(listId: Array<string>): Promise<CustomProduct[]> {
		const products = await this.productModel
			.find({ _id: { $in: listId } })
			.select('-createdAt')
			.lean({ virtuals: ['mainImage'] })
			.exec()
		return products as unknown as CustomProduct[]
	}

	async getListForAdminApp(
		query: GetProductListAdminFilterDto
	): Promise<ProductItemForAdmin[]> {
		const [sortBy, sortOrder] = [
			query.sortBy ?? 'name',
			query.sortOrder === SortOrder.DESC ? '-' : '',
		]

		const filter = {
			...(query.keyword ? { $text: { $search: query.keyword } } : {}),
			...(query.category
				? { category: new Types.ObjectId(query.category) }
				: {}),
			...(query.status === Status.DISABLED
				? { deleted: true }
				: query.status === Status.ENABLE
				? { deleted: false }
				: {}),
		}

		const [productList, productInOrder] = await Promise.all([
			this.productModel
				.find(filter)
				.select(
					'name originalPrice category updatedAt images deleted deletedAt'
				)
				.populate<{ category: Category }>('category')
				.sort(sortOrder + sortBy)
				.lean({ virtuals: ['mainImage'] })
				.exec(),
			this.orderModel.aggregate<ProductInOrders>([
				...weekAnalyticPipeline(),
				{
					$project: { week: 1, items: 1 },
				},
				{
					$match: { week: { $gte: 0 } },
				},
				{
					$unwind: '$items',
				},
				{
					$group: {
						_id: {
							productId: '$items.productId',
						},
						amountOneWeekAgo: {
							$sum: {
								$cond: {
									if: {
										$eq: ['$week', 0],
									},
									then: '$items.amount',
									else: 0,
								},
							},
						},
						amountTwoWeekAgo: {
							$sum: {
								$cond: {
									if: {
										$eq: ['$week', 1],
									},
									then: '$items.amount',
									else: 0,
								},
							},
						},
					},
				},
				{
					$addFields: {
						_id: '$_id.productId',
					},
				},
			]),
		])

		const productInOrderMap: Record<
			string,
			Pick<ProductItemForAdmin, 'saleOfWeek' | 'changedAmount'>
		> = productInOrder.reduce((res, value) => {
			return Object.assign(res, {
				[value._id.toString()]: {
					saleOfWeek: value.amountOneWeekAgo,
					changedAmount: value.amountOneWeekAgo - value.amountTwoWeekAgo,
				},
			})
		}, {})

		const res: ProductItemForAdmin[] = productList.map(product => ({
			_id: product._id,
			name: product.name,
			mainImage: product.mainImage,
			originalPrice: product.originalPrice,
			categoryId: product.category._id.toString(),
			categoryName: product.category.name,
			updatedAt: product.updatedAt,
			...(productInOrderMap[product._id.toString()] ?? {
				saleOfWeek: 0,
				changedAmount: 0,
			}),
			deleted: product.deleted,
			deletedAt: product.deletedAt,
		}))
		return res
	}

	async getDetailForAdminApp(productId: string) {
		const product = await this.productModel
			.findById(productId)
			.populate<{ disableFlag: ProductActionTimer }>('disableFlag')
			.lean({ virtuals: true })
			.exec()
		return product
	}

	async updateProductInfo(productId: string, dto: UpdateProductInfoDto) {
		const options: Option = {
			size: dto.size,
			topping: dto.topping,
		}
		delete dto['size']
		delete dto['topping']
		const updateStatus = await this.productModel
			.updateOne(
				{ _id: productId },
				{
					...dto,
					...(options.size ? { 'options.size': options.size } : {}),
					...(options.topping ? { 'options.topping': options.topping } : {}),
				}
			)
			.orFail(new NotModifiedDataException())
			.exec()
		return updateStatus.modifiedCount > 0
	}

	async updateProductImage(
		productId: string,
		newImages: Array<string>,
		deletedImages: Array<string>
	) {
		const product = await this.productModel
			.findById(productId)
			.orFail(new NotFoundDataException('product'))
			.select('images')
			.lean()
			.exec()
		deletedImages = deletedImages.filter(image =>
			product.images.includes(image)
		)
		const images = product.images
			.filter(image => !deletedImages.includes(image))
			.concat(newImages)
		const [deleteImageStatus, updateStatus] = await Promise.all([
			this.fileService.deleteMany(deletedImages),
			this.productModel.updateOne(
				{ _id: productId },
				{
					images,
				}
			),
		])
		return deleteImageStatus && updateStatus.modifiedCount === 1
	}

	async disable(id: string, isFlag = false): Promise<boolean> {
		const updateResult = await this.productModel
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

	async addDisableFlag(productId: string, timer: number) {
		await this.productModel
			.findOne({ _id: productId })
			.orFail(new NotFoundDataException('product'))
			.exec()
		const flagId = new Types.ObjectId()
		const [flag, productUpdateStatus] = await Promise.all([
			this.productActionTimerModel.create({
				_id: flagId,
				expireAt: timer,
			}),
			this.productModel
				.updateOne(
					{ _id: productId },
					{
						disableFlag: flagId,
					}
				)
				.orFail(new NotModifiedDataException())
				.exec(),
		])
		return !!flag && productUpdateStatus.modifiedCount === 1
	}

	async enable(productId: string): Promise<boolean> {
		const updateResult = await this.productModel
			.updateOne(
				{ _id: productId },
				{
					$set: { deleted: false },
					$unset: { deletedAt: 1, disableFlag: 1 },
				}
			)
			.orFail(new NotModifiedDataException())
			.exec()
		return updateResult.modifiedCount === 1
	}

	async destroy(productId: string) {
		const product = await this.productModel
			.findOne({ _id: productId })
			.lean()
			.exec()
		if (!product.deleted) {
			throw new BadRequestException(
				'Cannot destroy product, need to disable first'
			)
		}
		const result = await this.productModel
			.deleteOne({ _id: productId })
			.lean()
			.exec()
		return result.deletedCount === 1
	}
}
