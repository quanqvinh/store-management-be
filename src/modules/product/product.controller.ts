import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common'
import { ProductService } from './product.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { JoiValidatePine } from '@/common/pipes'
import {
	CreateProductDto,
	CreateProductDtoSchema,
} from './dto/request/create-product.dto'
import { File } from '@/types'
import { LackOfImageException } from '@/common/exceptions/http'
import { Product } from './schemas/product.schema'

@Controller('product')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Get('all')
	async getAll() {
		// const categories = await this.categoryService.getAll()
		// const allProducts = await this.productService.getAll()

		// const productClassification: Record<string, Array<Product>> = {}
		// allProducts.forEach((product, index) => {
		// 	const categorySlug = product.category.slug
		// 	if (!productClassification[categorySlug])
		// 		productClassification[categorySlug] = []
		// 	delete allProducts[index].category
		// 	productClassification[categorySlug].push(product)
		// })

		// const result = categories.map(category => {
		// 	return { ...category, products: productClassification[category.slug] }
		// })
		// return result
		return await this.productService.getAll()
	}

	@Post('create')
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 4 }]))
	async create(
		@UploadedFiles()
		{
			images,
		}: {
			images?: Array<File>
		},
		@Body(new JoiValidatePine(CreateProductDtoSchema))
		createProductDto: CreateProductDto
	) {
		return await this.productService.create(
			createProductDto,
			images?.map(image => image.id)
		)
	}
}
