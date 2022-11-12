import { CreateProductDto } from './dto/request/create-product.dto'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Product, ProductDocument } from './schemas/product.schema'
import { Model } from 'mongoose'
import { DatabaseConnectionName } from '@/constants'
import { Category, CategoryDocument } from '../category/schemas/category.schema'
import { CategoryService } from '../category/category.service'
import { MemberAppService } from '../setting/services/member-app.service'
import { ProductWithCategoryDto } from './dto/response/product-with-category.dto'

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name, DatabaseConnectionName.DATA)
		private readonly productModel: Model<ProductDocument>,
		@InjectModel(Category.name, DatabaseConnectionName.DATA)
		private readonly categoryModel: Model<CategoryDocument>,
		private categoryService: CategoryService,
		private memberAppService: MemberAppService
	) {}

	async getCategoryWithProduct() {
		const categories = await this.categoryService.getAll()
		const products = await this.getAll()
		return { categories, products }
	}

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

	async getAll(): Promise<ProductWithCategoryDto> {
		const productsWithCategory = await this.productModel.aggregate([
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
		])
		return productsWithCategory as unknown as ProductWithCategoryDto
	}
}
