import { Size, Topping } from '../../schemas/option.schema'
import * as Joi from 'joi'
import { objectIdPattern, sizeKeyPattern } from '@/common/validators'

export class CreateProductDto {
	name: string
	category: string
	originalPrice: number
	description: string
	size: Array<Size>
	topping: Array<Topping>
}

export const CreateProductDtoSchema = Joi.object<CreateProductDto>({
	name: Joi.string().required(),
	category: Joi.string().pattern(objectIdPattern).required(),
	originalPrice: Joi.number().required(),
	description: Joi.string().optional(),
	size: Joi.array()
		.items(
			Joi.object<Size>({
				name: Joi.string().required(),
				key: Joi.string().pattern(sizeKeyPattern).required(),
				fee: Joi.number().required(),
			})
		)
		.optional(),
	topping: Joi.array()
		.items(
			Joi.object<Topping>({
				name: Joi.string().required(),
				fee: Joi.number().required(),
			})
		)
		.optional(),
})
