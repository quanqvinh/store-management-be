import { CartController } from './cart.controller'
import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { ProductModule } from '../product/product.module'
import { StoreModule } from '../store/store.module'
import { AppliedCouponModule } from '../applied-coupon/applied-coupon.module'

@Module({
	imports: [ProductModule, StoreModule, AppliedCouponModule],
	controllers: [CartController],
	providers: [CartService],
	exports: [CartService],
})
export class CartModule {}
