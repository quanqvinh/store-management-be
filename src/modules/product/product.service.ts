import { CreateProductDto } from './dto/request/create-product.dto'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Product, ProductDocument } from './schemas/product.schema'
import { Model } from 'mongoose'
import { DatabaseConnectionName } from '@/constants'
import { Category, CategoryDocument } from '../category/schemas/category.schema'
import { CategoryService } from '../category/category.service'
import { MemberAppService } from '../setting/services/member-app.service'
// import { ProductWithCategoryDto } from './dto/response/product-with-category.dto'
import { StoreService } from '../store/store.service'
import {
	CustomProduct,
	ProductOfCategoryWithStatusDto,
} from './dto/response/product-member-app.dto'

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name, DatabaseConnectionName.DATA)
		private readonly productModel: Model<ProductDocument>,
		@InjectModel(Category.name, DatabaseConnectionName.DATA)
		private readonly categoryModel: Model<CategoryDocument>,
		private categoryService: CategoryService,
		private memberAppService: MemberAppService,
		private storeService: StoreService
	) {}

	async create(
		dto: CreateProductDto,
		imageIds: Array<string> | undefined
	): Promise<Product> {
		const [defaultProductImage, _category] = await Promise.all([
			this.memberAppService.getDefaultImages('product'),
			this.categoryService.getOne(dto.category),
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

	async getAllOfStoreInMemberApp(
		storeId?: string
	): Promise<ProductOfCategoryWithStatusDto> {
		const unavailableProductIds = storeId
			? await this.storeService.getUnavailableProductsOfStore(storeId)
			: []

		const [unavailableProducts, productsWithCategory] = await Promise.all([
			this.productModel
				.find({ _id: { $in: unavailableProductIds } })
				.select('-category -createdAt -updatedAt')
				.lean({ virtuals: ['mainImage'] })
				.exec(),
			this.productModel.aggregate([
				{ $match: { _id: { $nin: unavailableProductIds } } },
				{ $unwind: '$category' },
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
}
