import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common'
import { ProductService } from '../services/product.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { JoiValidatePine } from '@/common/pipes'
import {
	CreateProductDto,
	CreateProductDtoSchema,
} from '../dto/request/create-product.dto'
import { File } from '@/types'
import { LackOfImageException } from '@/common/exceptions/http'
import { CategoryService } from '../services/category.service'
import { Product } from '../schemas/product.schema'

@Controller('product')
export class ProductController {
	constructor(
		private productService: ProductService,
		private categoryService: CategoryService
	) {}

	@Get('all')
	async getAll() {
		const categories = await this.categoryService.getAll()
		const allProducts = await this.productService.getAll()

		const productClassification: Record<string, Array<Product>> = {}
		allProducts.forEach((product, index) => {
			const categorySlug = product.category.slug
			if (!productClassification[categorySlug])
				productClassification[categorySlug] = []
			delete allProducts[index].category
			productClassification[categorySlug].push(product)
		})

		const result = categories.map(category => {
			return { ...category, products: productClassification[category.slug] }
		})
		return result
	}

	@Post('create')
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'categoryImage', maxCount: 1 },
			{ name: 'productImages', maxCount: 4 },
		])
	)
	async create(
		@UploadedFiles()
		files: {
			categoryImage?: Array<File>
			productImages?: Array<File>
		},
		@Body(new JoiValidatePine(CreateProductDtoSchema))
		createProductDto: CreateProductDto
	) {
		if (createProductDto.category.isNew && !files.categoryImage)
			throw new LackOfImageException('category')
		return await this.productService.create(
			createProductDto,
			createProductDto.category.isNew ? files.categoryImage : null,
			files.productImages
		)
	}
}
