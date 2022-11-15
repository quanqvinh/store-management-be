import { JwtAccessTokenGuard, MemberAuth, User } from '@/common/decorators'
import { JoiValidatePine } from '@/common/pipes'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CartService } from './cart.service'
import { CartDtoSchema, CartDto } from './dto/request/cart.dto'

@Controller('cart')
@ApiTags('cart')
export class CartController {
	constructor(private cartService: CartService) {}

	@Get('load')
	@JwtAccessTokenGuard()
	async loadMemberCartData(
		@User() member: MemberAuth,
		@Query(new JoiValidatePine(CartDtoSchema)) cartDto: CartDto
	) {
		return await this.cartService.loadCartData(member.id, cartDto)
	}
}
