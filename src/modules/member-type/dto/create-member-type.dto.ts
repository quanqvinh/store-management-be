import { colorPattern } from '@/common/validators'
import * as Joi from 'joi'

export class CreateMemberTypeDto {
	name: string
	rank?: number
	color?: string
	condition?: number
	coefficientPoint?: number
}

export const CreateMemberTypeDtoSchema = Joi.object<CreateMemberTypeDto>({
	name: Joi.string().required(),
	rank: Joi.number().min(0).optional(),
	color: Joi.string().pattern(colorPattern).optional(),
	condition: Joi.number().min(0).optional(),
	coefficientPoint: Joi.number().min(1).optional(),
})
