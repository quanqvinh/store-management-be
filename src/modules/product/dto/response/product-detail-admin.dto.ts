import { OmitType, PickType } from '@nestjs/swagger'
import { Product } from '../../schemas/product.schema'
import { Category } from '@/modules/category/schemas/category.schema'
import { ProductActionTimer } from '../../schemas/product-action-timer.schema'

export class CategoryInShort extends PickType(Category, ['name', 'image']) {
	_id: string
}

export class ProductWithFlag extends OmitType(Product, ['disableFlag']) {
	disableFlag: ProductActionTimer
}

export class ProductDetailAdminDto {
	productDetail: ProductWithFlag
	allCategories: Array<CategoryInShort>
}
