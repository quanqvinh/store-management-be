import { CreateProductDto } from './dto/request/create-product.dto'
import { Get, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Product, ProductDocument } from './schemas/product.schema'
import { Model } from 'mongoose'
import { DatabaseConnectionName } from '@/constants'
import { Category, CategoryDocument } from '../category/schemas/category.schema'
import { CategoryService } from '../category/category.service'
import { MemberAppService } from '../setting/services/member-app.service'

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

	async getAll() {
		return this.productModel
			.find()
			.populate<{ category: Category }>('category')
			.sort('category.hot category.order originalPrice -createdAt')
			.select('-updatedAt')
			.lean({ virtuals: true })
			.exec()
	}

	// async create(
	// 	createProductDto: CreateProductDto,
	// 	categoryImage: Array<File>,
	// 	productImages: Array<File>
	// ) {
	// 	let category
	// 	if (createProductDto.category.isNew)
	// 		category = {
	// 			name: createProductDto.category.name,
	// 			image: categoryImage[0].id,
	// 		}
	// 	else
	// 		category = await this.categoryService.getOne(
	// 			createProductDto.category.name
	// 		)
	// 	return this.productModel.create({
	// 		name: createProductDto.name,
	// 		images:
	// 			productImages?.length > 0 && productImages[0].id
	// 				? productImages.map(file => file.id)
	// 				: [],
	// 		originPrice: createProductDto.originalPrice,
	// 		category,
	// 		description: createProductDto.description,
	// 		options: {
	// 			size: createProductDto.size,
	// 			topping: createProductDto.topping ?? [],
	// 		},
	// 	})
	// }
}
