import { CreateOrderDto } from './dto/request/create-order.dto'
import {
	CreateOrderBySalespersonDto,
	CreateOrderBySalespersonDtoSchema,
} from './dto/request/create-order-by-salesperson.dto'
import {
	JwtAccessTokenGuard,
	MemberAuth,
	EmployeeAuth,
	User,
} from '@/common/decorators'
import { Auth } from '@/common/decorators/auth.decorator'
import { JoiValidatePine } from '@/common/pipes'
import { EmployeeRole, OrderType } from '@/constants'
import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
	CreateOrderByMemberDto,
	CreateOrderByMemberDtoSchema,
} from './dto/request/create-order-by-member.dto'
import { OrderService } from './services'

@Controller('order')
@ApiTags('order')
export class OrderController {
	constructor(private orderService: OrderService) {}

	@Post('member')
	@JwtAccessTokenGuard()
	async createOrderByMember(
		@User() member: MemberAuth,
		@Body(new JoiValidatePine(CreateOrderByMemberDtoSchema))
		createMemberOrderDto: CreateOrderByMemberDto
	) {
		return await this.orderService.createMemberOrder(
			member.id,
			createMemberOrderDto
		)
	}

	@Post('salesperson')
	@Auth(EmployeeRole.SALESPERSON)
	async createOrderBySalesperson(
		@User() employee: EmployeeAuth,
		@Body(new JoiValidatePine(CreateOrderBySalespersonDtoSchema))
		createOrderBySalespersonDto: CreateOrderBySalespersonDto
	) {
		const createOrderDto: CreateOrderDto = {
			storeId: employee.store,
			items: createOrderBySalespersonDto.items,
			payment: createOrderBySalespersonDto.payment,
			paidAmount: createOrderBySalespersonDto.paidAmount,
		}
		if (!createOrderBySalespersonDto.memberId) {
			return await this.orderService.createCustomerOrder(createOrderDto)
		} else {
			const createMemberOrderDto: CreateOrderByMemberDto = {
				...createOrderDto,
				type: OrderType.ON_PREMISES,
				couponId: createOrderBySalespersonDto.couponId,
			}
			return await this.orderService.createMemberOrderInfo(
				createOrderBySalespersonDto.memberId,
				createMemberOrderDto
			)
		}
	}

	@Get('member/check-coupon')
	@JwtAccessTokenGuard()
	async checkCouponAfterUpdateCart(
		@User() member: MemberAuth,
		@Query(new JoiValidatePine(CreateOrderByMemberDtoSchema))
		checkCouponDto: CreateOrderByMemberDto
	) {
		return (
			await this.orderService.createMemberOrderInfo(member.id, checkCouponDto)
		).coupon
	}

	@Get('store/all')
	@Auth(EmployeeRole.SALESPERSON)
	async getOrdersOfStore(@User() employee: EmployeeAuth) {
		return this.orderService.getOrdersOfStore(employee.store)
	}

	@Patch(':code/update-status')
	@Auth(EmployeeRole.SALESPERSON)
	async updateOrderStatus(
		@User() employee: EmployeeAuth,
		@Param('code') orderCode: string
	) {
		return await this.orderService.updateStatus(employee.store, orderCode)
	}

	@Get('member/all')
	@JwtAccessTokenGuard()
	async getOrdersOfMember(@User() member: MemberAuth) {
		return await this.orderService.getOrdersOfMember(member.id)
	}
}
