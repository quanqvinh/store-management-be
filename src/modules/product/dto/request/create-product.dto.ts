import { Size, Topping } from '../../schemas/option.schema'
import * as Joi from 'joi'
import { sizeKeyPattern } from '@/common/validators'

export class CreateProductDto {
	name: string
	category: {
		isNew: boolean
		name: string
	}
	originalPrice: number
	description: string
	size: Array<Size>
	topping: Array<Topping>
}

export const CreateProductDtoSchema = Joi.object({
	name: Joi.string().required(),
	category: Joi.object({
		isNew: Joi.boolean().required().default(false),
		name: Joi.string().required(),
	}).required(),
	originalPrice: Joi.number().required(),
	description: Joi.string().optional(),
	size: Joi.array()
		.items(
			Joi.object({
				name: Joi.string().required(),
				key: Joi.string().pattern(sizeKeyPattern).required(),
				fee: Joi.number().required(),
			})
		)
		.required(),
	topping: Joi.array()
		.items(
			Joi.object({
				name: Joi.string().required(),
				fee: Joi.number().required(),
			})
		)
		.optional(),
})
