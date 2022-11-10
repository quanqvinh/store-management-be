import { colorPattern } from '@/common/validators'
import * as Joi from 'joi'

export class CreateMemberRankDto {
	name: string
	rank?: number
	color?: string
	condition?: number
	coefficientPoint?: number
}

export const CreateMemberRankDtoSchema = Joi.object<CreateMemberRankDto>({
	name: Joi.string().required(),
	rank: Joi.number().min(0).optional(),
	color: Joi.string().pattern(colorPattern).optional(),
	condition: Joi.number().min(0).optional(),
	coefficientPoint: Joi.number().min(1).optional(),
})
