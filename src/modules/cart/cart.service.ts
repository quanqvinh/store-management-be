import { Injectable } from '@nestjs/common'
import { CartDto } from './dto/request/cart.dto'
import { AppliedCouponService } from '../applied-coupon/applied-coupon.service'
import { CartDataDto } from './dto/response/cart-data.dto'
import { CustomProduct } from '../product/dto/response/product-member-app.dto'
import { ProductService } from '../product/product.service'
import { StoreService } from '../store/store.service'

@Injectable()
export class CartService {
	constructor(
		private storeService: StoreService,
		private productService: ProductService,
		private appliedCouponService: AppliedCouponService
	) {}

	async loadCartData(memberId: string, dto: CartDto): Promise<CartDataDto> {
		const [store, items, coupon] = await Promise.all([
			dto.storeId
				? this.storeService.getOne(
						{ id: dto.storeId, slug: dto.storeId },
						'_id name fullAddress'
				  )
				: null,
			this.productService.getForMemberApp(dto.itemIds),
			this.appliedCouponService.getOne(memberId, dto.appliedCouponId),
		])

		return {
			store: store
				? {
						id: store._id.toString(),
						name: store.name,
						address: (store['fullAddress'] as string) ?? '',
				  }
				: undefined,
			items: items as unknown as Array<CustomProduct>,
			coupon: coupon
				? this.appliedCouponService.transformForMemberApp(coupon)
				: null,
		}
	}
}
