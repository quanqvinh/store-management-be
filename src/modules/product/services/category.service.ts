import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category } from '../schemas/category.schema'
import { Product, ProductDocument } from '../schemas/product.schema'

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel(Product.name)
		private readonly productModel: Model<ProductDocument>
	) {}

	async getProductCategories(): Promise<Category[]> {
		const result = await this.productModel
			.find()
			.select('category')
			.distinct('category')
			.lean()
			.exec()
		return result.map((document: Product) => document.category)
	}
}
