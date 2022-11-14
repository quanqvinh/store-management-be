import { StoreInShort } from '@/modules/order/schemas/order.schema'
import { CustomOwnCoupon } from '@/modules/applied-coupon/dto/response/own-coupon.dto'
import { CustomProduct } from '@/modules/product/dto/response/product-member-app.dto'

export class CartDataDto {
	store?: StoreInShort
	items: Array<CustomProduct>
	coupon?: CustomOwnCoupon
}
