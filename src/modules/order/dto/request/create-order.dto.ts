import { OrderItem } from './../../schemas/order-item.schema'
import * as Joi from 'joi'
import { StoreInShort } from '../../schemas'
import { objectIdPattern } from '@/common/validators'
import {
	SizeOption,
	ToppingOption,
} from '@/modules/product/schemas/option.schema'
import { PaymentType, Size } from '@/constants'

class CartOrderItem extends OrderItem {
	productUpdatedAt: Date
}

export class CreateOrderDto {
	store: StoreInShort
	items: Array<CartOrderItem>
	payment: PaymentType
}

export const CreateOrderDtoSchema = {
	store: Joi.object<StoreInShort>({
		id: Joi.string().pattern(objectIdPattern).required(),
		name: Joi.string().required(),
		address: Joi.string().required(),
	}),
	items: Joi.array().items(
		Joi.object<CartOrderItem>({
			productId: Joi.string().pattern(objectIdPattern).required(),
			name: Joi.string().required(),
			originalPrice: Joi.number().required(),
			productUpdatedAt: Joi.date().required(),
			size: Joi.object<SizeOption>({
				size: Joi.string()
					.valid(...Object.values(Size))
					.required(),
				cost: Joi.number().required(),
			}).required(),
			topping: Joi.array()
				.items(
					Joi.object<ToppingOption>({
						name: Joi.string().required(),
						cost: Joi.number().required(),
					})
				)
				.optional(),
			amount: Joi.number().min(1).required(),
			sumPrice: Joi.number().min(0).required(),
			note: Joi.string().max(50).optional(),
		})
	),
	payment: Joi.string()
		.valid(...Object.values(PaymentType))
		.default(PaymentType.CASH)
		.required(),
}
