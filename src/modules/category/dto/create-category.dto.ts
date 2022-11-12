import { ApiPropertyFile } from '@/common/decorators/file-swagger.decorator'
import { CategoryType } from '@/constants'
import * as Joi from 'joi'

export class CreateCategoryDto {
	@ApiPropertyFile()
	image: any
	name: string
	type: CategoryType
}

export const CreateCategoryDtoSchema = Joi.object<CreateCategoryDto>({
	name: Joi.string().required(),
	type: Joi.string()
		.valid(...Object.values(CategoryType))
		.required(),
})
