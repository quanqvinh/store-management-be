import { OrderType } from '@/constants'
import { CreateOrderDto, CreateOrderDtoSchema } from './create-order.dto'
import * as Joi from 'joi'
import { objectIdPattern } from '@/common/validators'

export class CreateMemberOrderDto extends CreateOrderDto {
	type: OrderType
	memberId: string
	appliedCouponId?: string
	deliveryAddress?: any
}

export const CreateMemberOrderDtoSchema = Joi.object<CreateMemberOrderDto>({
	...CreateOrderDtoSchema,
	type: Joi.string().valid(OrderType).required(),
	appliedCouponId: Joi.string().pattern(objectIdPattern).optional(),
	deliveryAddress: Joi.any().when('type', {
		is: OrderType.DELIVERY,
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
})
