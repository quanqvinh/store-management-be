import { DatabaseConnectionName } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category } from '../schemas/category.schema'
import { Product, ProductDocument } from '../schemas/product.schema'

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel(Product.name, DatabaseConnectionName.DATA)
		private readonly productModel: Model<ProductDocument>
	) {}

	async getAll(): Promise<Category[]> {
		const result = await this.productModel
			.find()
			.sort('createdAt')
			.select('category name')
			.distinct('category')
			.lean()
			.exec()
		return result as Category[]
	}

	async getOne(category: string): Promise<Category> {
		const result = await this.productModel
			.findOne({
				$or: [{ 'category.slug': category }, { 'category.name': category }],
			})
			.select('category')
			.lean()
			.exec()
		return result?.category ?? null
	}
}
