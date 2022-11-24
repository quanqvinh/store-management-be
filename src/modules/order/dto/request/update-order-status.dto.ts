import { OrderStatus } from '@/constants'
import * as Joi from 'joi'
import { objectIdPattern } from '@/common/validators'

export class UpdateOrderStatusDto {
	orderId: string
	status: OrderStatus
}

export const UpdateOrderStatusDtoSchema = Joi.object<UpdateOrderStatusDto>({
	orderId: Joi.string().pattern(objectIdPattern).required(),
	status: Joi.string()
		.valid(OrderStatus.CANCELLED, OrderStatus.DONE)
		.required(),
})
