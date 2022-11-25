import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CartService } from './cart.service'

@Controller('cart')
@ApiTags('cart')
export class CartController {
	constructor(private cartService: CartService) {}

	// @Get('load')
	// @JwtAccessTokenGuard()
	// async loadMemberCartData(
	// 	@User() member: MemberAuth,
	// 	@Query(new JoiValidatePine(CartDtoSchema)) cartDto: CartDto
	// ) {
	// 	return await this.cartService.loadCartData(member.id, cartDto)
	// }
}
