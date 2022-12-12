import { OmitType } from '@nestjs/swagger'
import { CreateProductDto } from './create-product.dto'
import * as Joi from 'joi'
import { objectIdPattern } from '@/common/validators'
import { SizeOption, ToppingOption } from '../../schemas/option.schema'
import { Size } from '@/constants'

export class UpdateProductInfoDto extends OmitType(CreateProductDto, [
	'images',
]) {}

export const UpdateProductInfoDtoSchema = Joi.object({
	name: Joi.string().optional(),
	category: Joi.string().pattern(objectIdPattern).optional(),
	originalPrice: Joi.number().optional(),
	description: Joi.string().optional(),
	size: Joi.array()
		.items(
			Joi.object<SizeOption>({
				size: Joi.number()
					.valid(...Object.values(Size))
					.required(),
				cost: Joi.number().required(),
			})
		)
		.optional(),
	topping: Joi.array()
		.items(
			Joi.object<ToppingOption>({
				name: Joi.string().required(),
				cost: Joi.number().required(),
			})
		)
		.optional(),
}).min(1)
