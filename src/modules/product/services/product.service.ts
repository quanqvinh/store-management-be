import { CreateProductDto } from './../dto/request/create-product.dto'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Product, ProductDocument } from '../schemas/product.schema'
import { Model } from 'mongoose'
import { CategoryService } from './category.service'
import { File } from '@/types'
import { DatabaseConnectionName } from '@/constants'
import { Category } from '../schemas/category.schema'

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name, DatabaseConnectionName.DATA)
		private readonly productModel: Model<ProductDocument>,
		private categoryService: CategoryService
	) {}

	async getAll() {
		return this.productModel
			.find()
			.sort('originalPrice -createdAt')
			.select('-updatedAt')
			.lean({ virtuals: true })
			.exec()
	}

	async create(
		createProductDto: CreateProductDto,
		categoryImage: Array<File>,
		productImages: Array<File>
	) {
		let category
		if (createProductDto.category.isNew)
			category = {
				name: createProductDto.category.name,
				image: categoryImage[0].id,
			}
		else
			category = await this.categoryService.getOne(
				createProductDto.category.name
			)
		return this.productModel.create({
			name: createProductDto.name,
			images: productImages.map(file => file.id),
			originPrice: createProductDto.originalPrice,
			category,
			description: createProductDto.description,
			options: {
				size: createProductDto.size,
				topping: createProductDto.topping ?? [],
			},
		})
	}
}
