import { objectIdPattern } from '@/common/validators'
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import * as Joi from 'joi'
import { Promotion, PromotionPrivilege } from '../../schemas/promotion.schema'

class CreatePromotionPrivilege extends OmitType(PromotionPrivilege, [
	'sold',
	'beginTime',
]) {
	@ApiProperty({ example: Date.now() })
	beginTime: number
}

export class CreatePromotionDto extends PickType(Promotion, [
	'coupon',
	'title',
	'cost',
	'description',
]) {
	privilege: CreatePromotionPrivilege[]
}

export const CreatePromotionDtoSchema = Joi.object<CreatePromotionDto>({
	coupon: Joi.string().pattern(objectIdPattern).required(),
	title: Joi.string().required(),
	cost: Joi.number().min(0).required(),
	description: Joi.string().optional(),
	privilege: Joi.array().items(
		Joi.object<CreatePromotionPrivilege>({
			applyTo: Joi.string().pattern(objectIdPattern).required(),
			beginTime: Joi.number().min(0).required(),
			endTime: Joi.number().min(Joi.ref('beginTime')).optional(),
			limit: Joi.number().min(1).optional(),
		})
	),
})
