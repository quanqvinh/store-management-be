import { objectIdPattern } from '@/common/validators'
import { PaymentType, Size } from '@/constants'
import { ApiProperty } from '@nestjs/swagger'
import * as Joi from 'joi'

export class CartItem {
	itemId: string
	@ApiProperty({
		type: 'number',
		description: '0 is SMALL, 1 is MEDIUM,  2 is LARGE',
		example: 0,
	})
	size?: Size
	toppings?: Array<string>
	@ApiProperty({ example: 1 })
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
