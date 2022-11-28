import { OrderListByStatusDto } from './../dto/response/order-list-by-status.dto'
import { MemberAppService } from './../../setting/services/member-app.service'
import {
	CannotUseCouponException,
	NotFoundDataException,
} from '@/common/exceptions/http'
import {
	Buyer,
	DatabaseConnectionName,
	OrderStatus,
	OrderType,
} from '@/constants'
import { Coupon } from '@/modules/coupon/schemas/coupon.schema'
import { MemberService } from '@/modules/member/member.service'
import { ProductService } from '@/modules/product/product.service'
import { StoreService } from '@/modules/store/store.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreateOrderByMemberDto } from '../dto/request/create-order-by-member.dto'
import { CartItem, CreateOrderDto } from '../dto/request/create-order.dto'
import {
	CustomerOrderDocument,
	MemberOrder,
	MemberOrderDocument,
	Order,
	OrderDocument,
	OrderItem,
	OrderStatusItem,
} from '../schemas'
import { MemberRankService } from '@/modules/member-rank/member-rank.service'
import { memberAppDefault } from '@/modules/setting/schemas/default/member-app.default'

type ItemDictionary = Record<string, Omit<CartItem, 'itemId'>>

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Order.name, DatabaseConnectionName.DATA)
		private readonly orderModel: Model<OrderDocument>,
		@InjectModel(Buyer.MEMBER, DatabaseConnectionName.DATA)
		private readonly memberOrderModel: Model<MemberOrderDocument>,
		@InjectModel(Buyer.CUSTOMER, DatabaseConnectionName.DATA)
		private readonly customerOrderModel: Model<CustomerOrderDocument>,
		private storeService: StoreService,
		private productService: ProductService,
		private memberService: MemberService,
		private memberAppService: MemberAppService,
		private memberRankService: MemberRankService
	) {}

	async createMemberOrder(memberId: string, dto: CreateOrderByMemberDto) {
		const memberOrder = await this.createMemberOrderInfo(memberId, dto)
		if (dto.couponId) {
			const result = await Promise.all([
				this.memberOrderModel.create(memberOrder),
				// this.memberService.deleteAppliedCoupon(memberId, dto.couponId),
				null,
			])
			return result[0]
		} else {
			return await this.memberOrderModel.create(memberOrder)
		}
	}

	private async createOrderInfo(dto: CreateOrderDto, buyer: Buyer) {
		const itemDictionary: ItemDictionary = dto.items.reduce((dic, item) => {
			const { itemId, ...cartItemData } = item
			Object.assign(dic, {
				[itemId]: cartItemData,
			})
			return dic
		}, {})

		const store = await this.storeService.getOne(
			{ id: dto.storeId },
			'_id name fullAddress'
		)
		const items = await this.productService.getForMemberApp(
			Object.keys(itemDictionary)
		)
		const baseOrder: Order = {
			buyer: buyer,
			store: {
				id: store._id,
				name: store.name,
				address: store.fullAddress,
			},
			items: items.map((item): OrderItem => {
				const itemInCart = itemDictionary[item._id.toString()]
				return {
					productId: item._id,
					categoryId: new Types.ObjectId(item.category.toString()),
					name: item.name,
					originalPrice: item.originalPrice,
					size: itemInCart?.size
						? item.options.size.find(size => size.size === itemInCart.size)
						: undefined,
					toppings: itemInCart.toppings
						?.map(toppingName => {
							return item.options.topping.find(
								topping => toppingName === topping.name
							)
						})
						.filter(topping => !!topping),
					amount: itemInCart.amount,
					itemPrice: null,
					note: itemInCart.note,
				}
			}),
			totalPrice: null,
			payment: dto.payment,
			paidAmount: dto.paidAmount ?? undefined,
		}

		let sumPrice = 0
		baseOrder.items.forEach((item, index) => {
			const sumPriceItem =
				(item.originalPrice +
					(item.size?.cost ?? 0) +
					(item.toppings?.reduce((sum, topping) => {
						return sum + topping.cost
					}, 0) ?? 0)) *
				item.amount
			baseOrder.items[index].itemPrice = sumPriceItem
			sumPrice += sumPriceItem
		})
		baseOrder.totalPrice = sumPrice
		return baseOrder
	}

	async createMemberOrderInfo(
		memberId: string,
		dto: CreateOrderByMemberDto
	): Promise<MemberOrder> {
		const baseOrder = await this.createOrderInfo(dto, Buyer.MEMBER)

		const member = await this.memberService.findById(memberId)
		const rank = await this.memberRankService.getOne({
			id: member.memberInfo.rank.toString(),
		})
		const appliedCoupon = dto.couponId
			? await this.memberService.checkCoupon(memberId, dto.couponId)
			: undefined

		let couponInfo = undefined
		if (appliedCoupon) {
			const coupon = appliedCoupon.coupon as unknown as Coupon
			const discountAmount = this.checkAndApplyCouponCondition(
				baseOrder,
				coupon,
				dto.type
			)
			baseOrder.totalPrice -= discountAmount
			couponInfo = {
				id: coupon._id,
				title: coupon.title,
				code: coupon.code,
				discountAmount,
			}
		}

		const earnedPoint = await this.calculatePoint(baseOrder.totalPrice)

		let { order: orderStatus } =
			dto.type === OrderType.ON_PREMISES
				? { order: undefined }
				: await this.memberAppService.get('order')

		if (orderStatus) {
			orderStatus = memberAppDefault.order
		}

		return {
			...baseOrder,
			type: dto.type,
			status: (dto.type === OrderType.PICKUP
				? orderStatus.pickupStatus
				: orderStatus.deliveryStatus) as OrderStatusItem[],
			member: {
				id: member._id,
				name: member.fullName,
				email: member.email,
				mobile: member.mobile,
				rankName: rank.name,
			},
			coupon: couponInfo,
			earnedPoint,
		}
	}

	checkAndApplyCouponCondition(order: Order, coupon: Coupon, type: OrderType) {
		const {
			includeAllCategoryIn,
			includeAllProductIn,
			includeOneCategoryIn,
			includeOneProductIn,
			minAmount,
			minPrice,
			orderType,
		} = coupon.orderCondition

		if (orderType && orderType !== type) {
			throw new CannotUseCouponException('order type is invalid')
		}
		if (minPrice && order.totalPrice < minPrice) {
			throw new CannotUseCouponException('items price is invalid')
		}
		if (
			minAmount &&
			order.items.reduce((amount, item) => amount + item.amount, 0) < minAmount
		) {
			throw new CannotUseCouponException('items amount is invalid')
		}
		if (includeAllCategoryIn?.length > 0) {
			// later
		}
		if (includeOneCategoryIn?.length > 0) {
			// later
		}
		if (includeAllProductIn?.length > 0) {
			// later
		}
		if (includeOneProductIn?.length > 0) {
			// later
		}

		let discountAmount = 0
		if (coupon.discount?.percentage) {
			discountAmount =
				(order.totalPrice * coupon.discount.percentage.amount) / 100
			if (coupon.discount.percentage.maxDecrease) {
				discountAmount = Math.min(
					coupon.discount.percentage.maxDecrease,
					discountAmount
				)
			}
		} else if (coupon.discount?.decrease) {
			discountAmount = Math.min(coupon.discount.decrease, order.totalPrice)
		} else if (coupon.discount?.price) {
			coupon.discount.price.forEach(newPriceCondition => {
				const orderItem = order.items.find(
					item =>
						item.productId.toString() ===
							newPriceCondition.product.toString() &&
						newPriceCondition.size === item.size.size &&
						(!item.toppings || item.toppings.length === 0)
				)
				discountAmount +=
					Math.min(orderItem.amount, newPriceCondition.amount) *
					(orderItem.originalPrice +
						orderItem.size.cost -
						newPriceCondition.newPrice)
			})
		} else if (coupon.discount?.freeMin) {
			const validItems = order.items
				.filter(item => {
					if (item.toppings && item.toppings.length > 0) return false
					const inListProducts = !!coupon.discount.freeMin?.products?.find(
						productId => productId.toString() === item.productId.toString()
					)
					const isValidCategory =
						item.categoryId.toString() ===
						coupon.discount.freeMin?.category?.toString()
					return inListProducts || isValidCategory
				})
				.sort((a, b) => {
					return a.originalPrice + a.size.cost - (b.originalPrice + b.size.cost)
				})
			discountAmount += validItems
				.slice(0, coupon.discount.freeMin.amount)
				.reduce((sum, item) => sum + item.originalPrice + item.size.cost, 0)
		}
		return discountAmount
	}

	private async calculatePoint(price: number) {
		const { startMilestone, pointPerUnit, unitStep } = (
			await this.memberAppService.get('point')
		)?.point ?? {
			startMilestone: 5000,
			pointPerUnit: 6,
			unitStep: 10000,
		}
		const temp = price - startMilestone
		if (temp < 0) {
			return 0
		}
		return pointPerUnit * (Math.floor(temp / unitStep) + 1)
	}

	async getOrdersOfStore(storeId: string): Promise<OrderListByStatusDto[]> {
		const orders = await this.orderModel
			.aggregate([
				{ $match: { 'store.id': new Types.ObjectId(storeId) } },
				{
					$group: {
						_id: '$status',
						orders: { $push: '$$ROOT' },
					},
				},
				{
					$addFields: {
						status: '$_id',
					},
				},
				{
					$project: {
						_id: 0,
						status: 1,
						orders: 1,
					},
				},
			])
			.exec()
		return orders as unknown as Array<OrderListByStatusDto>
	}

	async updateStatus(storeId: string, orderCode: string) {
		const order = await this.memberOrderModel
			.findOne({ code: orderCode, 'store.id': storeId })
			.orFail(new NotFoundDataException('Order'))
			// .select('status')
			.exec()

		const nextStatusIndex = order.status.findIndex(
			status => !status.checked && status.status !== OrderStatus.CANCELLED
		)
		if (nextStatusIndex < 0)
			throw new BadRequestException("Cannot update order's status")

		order.status[nextStatusIndex].checked = true
		order.status[nextStatusIndex].time = new Date(Date.now())

		const orderSaved = await order.save()

		return orderSaved === order
	}

	async getOrdersOfMember(memberId): Promise<OrderListByStatusDto[]> {
		const orders = await this.orderModel
			.aggregate([
				{ $match: { 'member.id': new Types.ObjectId(memberId) } },
				{
					$group: {
						_id: '$status',
						orders: { $push: '$$ROOT' },
					},
				},
				{
					$addFields: {
						status: '$_id',
					},
				},
				{
					$project: {
						_id: 0,
						status: 1,
						orders: 1,
					},
				},
			])
			.exec()
		return orders as unknown as Array<OrderListByStatusDto>
	}

	async createCustomerOrder(dto: CreateOrderDto) {
		const order = await this.createOrderInfo(dto, Buyer.CUSTOMER)
		return await this.customerOrderModel.create({
			...order,
		})
	}
}
