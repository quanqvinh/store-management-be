import { JwtAccessTokenGuard, MemberAuth, User } from '@/common/decorators'
import { JoiValidatePine } from '@/common/pipes'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
	CreateMemberOrderDto,
	CreateMemberOrderDtoSchema,
} from './dto/request/create-member-order.dto'
import { OrderService } from './services'

@Controller('order')
@ApiTags('order')
export class OrderController {
	constructor(private orderService: OrderService) {}

	@Post('member')
	@JwtAccessTokenGuard()
	async createMemberOrder(
		@User() member: MemberAuth,
		@Body(new JoiValidatePine(CreateMemberOrderDtoSchema))
		createMemberOrderDto: CreateMemberOrderDto
	) {
		return await this.orderService.createMemberOrder(
			member.id,
			createMemberOrderDto
		)
	}
}
