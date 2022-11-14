import { Category } from '@/modules/category/schemas/category.schema'
import { OmitType, PickType } from '@nestjs/swagger'
import { Product } from '../../schemas/product.schema'

class CustomCategory extends PickType(Category, [
	'_id',
	'name',
	'image',
	'slug',
] as const) {}

export class CustomProduct extends OmitType(Product, [
	'category',
	'createdAt',
]) {
	mainImage: string
}

class ProductOfCategoryDto {
	category: CustomCategory
	products: Array<CustomProduct>
}

export class ProductOfCategoryWithStatusDto {
	available: Array<ProductOfCategoryDto>
	unavailable: Array<CustomProduct>
}
