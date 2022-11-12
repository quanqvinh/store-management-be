import { Category } from '@/modules/category/schemas/category.schema'
import { OmitType, PickType } from '@nestjs/swagger'
import { Product } from '../../schemas/product.schema'

class CustomCategory extends PickType(Category, [
	'_id',
	'name',
	'image',
	'slug',
] as const) {}

class CustomProduct extends OmitType(Product, [
	'category',
	'createdAt',
	'updatedAt',
]) {
	mainImage: string
}

export class ProductWithCategoryDto {
	category: CustomCategory
	products: Array<CustomProduct>
}
