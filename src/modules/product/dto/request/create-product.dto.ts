import * as Joi from 'joi'
import { objectIdPattern } from '@/common/validators'
import { ApiPropertyMultiFiles } from '@/common/decorators/file-swagger.decorator'
import { SizeOption, ToppingOption } from '../../schemas/option.schema'
import { Size } from '@/constants'
import { PickType } from '@nestjs/swagger'

class CustomToppingOption extends PickType(ToppingOption, ['name', 'cost']) {}

export class CreateProductDto {
	@ApiPropertyMultiFiles()
	images: any
	name: string
	category: string
	originalPrice: number
	description: string
	size: Array<SizeOption>
	topping: Array<CustomToppingOption>
}

export const CreateProductDtoSchema = Joi.object<CreateProductDto>({
	name: Joi.string().required(),
	category: Joi.string().pattern(objectIdPattern).required(),
	originalPrice: Joi.number().required(),
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
})
