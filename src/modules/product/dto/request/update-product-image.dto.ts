import { ApiPropertyMultiFiles } from '@/common/decorators/file-swagger.decorator'
import { objectIdPattern } from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'
import * as Joi from 'joi'

export class UpdateProductImageDto {
	@ApiPropertyMultiFiles()
	newImages?: any
	@ApiProperty({ type: Object })
	deletedImages: string[]
}

export const UpdateProductImageDtoSchema = Joi.object({
	deletedImages: Joi.array()
		.items(Joi.string().pattern(objectIdPattern))
		.required(),
})
