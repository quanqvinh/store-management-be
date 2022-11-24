import {
	JwtAccessTokenGuard,
	MemberAuth,
	EmployeeAuth,
	User,
} from '@/common/decorators'
import { Auth } from '@/common/decorators/auth.decorator'
import { JoiValidatePine } from '@/common/pipes'
import { EmployeeRole } from '@/constants'
import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
	CreateMemberOrderDto,
	CreateMemberOrderDtoSchema,
} from './dto/request/create-member-order.dto'
import {
	UpdateOrderStatusDto,
	UpdateOrderStatusDtoSchema,
} from './dto/request/update-order-status.dto'
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

	@Get('member/check-coupon')
	@JwtAccessTokenGuard()
	async checkCouponAfterUpdateCart(
		@User() member: MemberAuth,
		@Query(new JoiValidatePine(CreateMemberOrderDtoSchema))
		checkCouponDto: CreateMemberOrderDto
	) {
		return (
			await this.orderService.createMemberOrderInfo(member.id, checkCouponDto)
		).coupon
	}

	@Get('store')
	@Auth(EmployeeRole.SALESPERSON)
	async getOrdersOfStore(@User() employee: EmployeeAuth) {
		return this.orderService.getOrdersOfStore(employee.store)
	}

	@Patch('update-status')
	@Auth(EmployeeRole.SALESPERSON)
	async updateOrderStatus(
		@User() employee: EmployeeAuth,
		@Body(new JoiValidatePine(UpdateOrderStatusDtoSchema))
		updateDto: UpdateOrderStatusDto
	) {
		return await this.orderService.updateStatus(employee.store, updateDto)
	}
}
