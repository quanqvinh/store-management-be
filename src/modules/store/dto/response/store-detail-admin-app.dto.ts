import { PickType } from '@nestjs/swagger'
import { Store } from '../../schemas/store.schema'
import { Product } from '@/modules/product/schemas/product.schema'

class ProductInShort extends PickType(Product, [
	'_id',
	'name',
	'originalPrice',
]) {
	mainImage: string
}

export class StoreDetailForAdminDto {
	storeDetail: Store
	allProductsInShort: ProductInShort[]
}
