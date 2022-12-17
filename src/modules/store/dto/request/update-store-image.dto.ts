import { ApiPropertyMultiFiles } from '@/common/decorators/file-swagger.decorator'
import { objectIdPattern } from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'
import * as Joi from 'joi'

export class UpdateStoreImageDto {
	@ApiPropertyMultiFiles()
	newImages?: any
	@ApiProperty({ type: Object, example: ['id'] })
	deletedImages?: string[]
}

export const UpdateStoreImageDtoSchema = Joi.object({
	deletedImages: Joi.array()
		.items(Joi.string().pattern(objectIdPattern))
		.required(),
})
