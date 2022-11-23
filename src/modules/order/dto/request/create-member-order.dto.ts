import { OrderType } from '@/constants'
import { CreateOrderDto, createOrderDtoSchemaObject } from './create-order.dto'
import * as Joi from 'joi'
import { objectIdPattern } from '@/common/validators'

export class CreateMemberOrderDto extends CreateOrderDto {
	type: OrderType
	couponId?: string
	deliveryAddress?: any
}

export const CreateMemberOrderDtoSchema = Joi.object<CreateMemberOrderDto>({
	...createOrderDtoSchemaObject,
	type: Joi.string()
		.valid(...Object.values(OrderType))
		.required(),
	couponId: Joi.string().pattern(objectIdPattern).optional(),
	deliveryAddress: Joi.any().when('type', {
		is: OrderType.DELIVERY,
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
})
