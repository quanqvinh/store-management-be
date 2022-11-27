import { OrderType } from '@/constants'
import { CreateOrderDto, createOrderDtoSchemaObject } from './create-order.dto'
import * as Joi from 'joi'
import { objectIdPattern } from '@/common/validators'

export class CreateOrderByMemberDto extends CreateOrderDto {
	/**
	 * @example pickup
	 */
	type: OrderType
	couponId?: string
	deliveryAddress?: any
}

export const CreateOrderByMemberDtoSchema = Joi.object<CreateOrderByMemberDto>({
	...createOrderDtoSchemaObject,
	type: Joi.string()
		.valid(
			...Object.values(OrderType).filter(
				type => ![OrderType.ON_PREMISES].includes(type)
			)
		)
		.required(),
	couponId: Joi.string().pattern(objectIdPattern).optional(),
	deliveryAddress: Joi.any().when('type', {
		is: OrderType.DELIVERY,
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
})
