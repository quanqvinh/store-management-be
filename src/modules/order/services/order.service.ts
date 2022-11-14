import { Buyer, DatabaseConnectionName, OrderType } from '@/constants'
import { StoreService } from '@/modules/store/store.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateMemberOrderDto } from '../dto/request/create-member-order.dto'
import { MemberOrder, Order, OrderDocument } from '../schemas'

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Order.name, DatabaseConnectionName.DATA)
		private readonly orderModel: Model<OrderDocument>,
		private storeService: StoreService
	) {}

	async createMemberOrder(
		memberId: string,
		dto: CreateMemberOrderDto
	): Promise<Order> {
		const order: Order & MemberOrder = {
			buyer: Buyer.MEMBER,
			store: dto.store,
			items: dto.items,
			totalPrice: null,
			payment: dto.payment,
			type: dto.type,
			deliveryAddress:
				dto.type === OrderType.DELIVERY ? dto.deliveryAddress : undefined,
			member: null,
			coupon: null,
			earnedPoint: null,
		}
		return order
	}
	// async createPickup(
	// 	dto: CreatePickupOrderDto,
	// 	memberId: string
	// ): Promise<Order> {
	// 	const shortInfoStore = await this.storeService.getOne(
	// 		dto.storeId,
	// 		'_id name fullAddress'
	// 	)
	// 	if (!shortInfoStore) throw new NotFoundDataException('Store')

	// 	return await this.orderModel.create({
	// 		buyer: Buyer.MEMBER,
	// 		store: {
	// 			_id: dto.storeId,
	// 			name: shortInfoStore.name,
	// 			address: shortInfoStore['fullAddress'],
	// 		},
	// 		items: {

	// 		}
	// 	})
	// }
}
