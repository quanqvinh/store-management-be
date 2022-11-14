import { objectIdPattern } from '@/common/validators'
import { OrderType, PaymentType } from '@/constants'
import * as Joi from 'joi'

enum MemberOrderType {
	DELIVERY = OrderType.DELIVERY,
	PICKUP = OrderType.PICKUP,
}

export class CartDto {
	orderType: MemberOrderType
	storeId?: string
	itemIds: Array<string>
	appliedCouponId?: string
	payment: PaymentType
}

export const CartDtoSchema = Joi.object<CartDto>({
	orderType: Joi.string()
		.valid(...Object.values(OrderType))
		.required(),
	storeId: Joi.string().pattern(objectIdPattern).when('orderType', {
		is: OrderType.PICKUP,
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
	itemIds: Joi.array()
		.items(Joi.string().pattern(objectIdPattern))
		.min(1)
		.required(),
	appliedCouponId: Joi.string().pattern(objectIdPattern).optional(),
	payment: Joi.string()
		.valid(...Object.values(PaymentType))
		.default(PaymentType.CASH)
		.required(),
})
