import { objectIdPattern } from '@/common/validators'
import { PaymentType, Size } from '@/constants'
import * as Joi from 'joi'

export class CartItem {
	itemId: string
	size?: Size
	toppings?: Array<string>
	amount: number
	note?: string
}

export class CreateOrderDto {
	storeId: string
	items: Array<CartItem>
	payment: PaymentType
	paidAmount?: number
}

export const createOrderDtoSchemaObject = {
	storeId: Joi.string().pattern(objectIdPattern).required(),
	items: Joi.array()
		.items(
			Joi.object<CartItem>({
				itemId: Joi.string().pattern(objectIdPattern).required(),
				size: Joi.number()
					.valid(...Object.values(Size))
					.optional(),
				toppings: Joi.array().items(Joi.string()).optional(),
				amount: Joi.number().min(1).required(),
				note: Joi.string().max(50).optional(),
			})
		)
		.min(1)
		.required(),
	payment: Joi.string().valid(...Object.values(PaymentType)),
	paidAmount: Joi.number().optional(),
}

export const CreateOrderDtoSchema = Joi.object<CreateOrderDto>(
	createOrderDtoSchemaObject
)
