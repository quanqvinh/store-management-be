import { CategoryType } from '@/constants'
import * as Joi from 'joi'

export class CreateCategoryDto {
	name: string
	type: CategoryType
}

export const CreateCategoryDtoSchema = Joi.object<CreateCategoryDto>({
	name: Joi.string().required(),
	type: Joi.string()
		.valid(...Object.values(CategoryType))
		.required(),
})
