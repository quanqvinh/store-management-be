import { OmitType, PickType } from '@nestjs/swagger'
import { Promotion, PromotionPrivilege } from '../../schemas/promotion.schema'
import * as coreJoi from 'joi'
import * as joiDate from '@joi/date'
import { objectIdPattern } from '@/common/validators'

const Joi = coreJoi.extend(joiDate.default(coreJoi)) as typeof coreJoi

export class InputPrivilege extends OmitType(PromotionPrivilege, ['sold']) {}

export class UpdatePromotionDto extends PickType(Promotion, [
	'title',
	'description',
	'coupon',
	'cost',
	'privilege',
	'opening',
]) {}

export const UpdatePromotionDtoSchema = Joi.object<UpdatePromotionDto>({
	title: Joi.string().optional(),
	description: Joi.string().optional(),
	coupon: Joi.string().pattern(objectIdPattern).optional(),
	cost: Joi.number().min(0).optional(),
	privilege: Joi.object<InputPrivilege>({
		applyTo: Joi.string().pattern(objectIdPattern).required(),
		beginTime: Joi.date().format('YYYY-MM-DD HH:mm').required(),
		endTime: Joi.date().format('YYYY-MM-DD HH:mm').optional(),
		limit: Joi.number().min(0).optional(),
	}).optional(),
	opening: Joi.boolean().optional(),
})
