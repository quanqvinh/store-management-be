import { objectIdPattern } from '@/common/validators/regex'
import { OrderType } from '@/constants'
import { Condition, IncludeProduct } from '../schemas/condition.schema'
import { DiscountType } from '../schemas/discount-type.schema'
import * as Joi from 'joi'

export class UpdateInfoCouponDto {
	title?: string
	code?: string
	discount?: Partial<DiscountType>
	description?: string
	orderCondition?: Partial<Condition>
	applyTime?: number
}

export const UpdateInfoCouponDtoSchema = Joi.object<UpdateInfoCouponDto>({
	title: Joi.string().optional(),
	code: Joi.string().token().optional(),
	discount: Joi.object<DiscountType>({
		percentage: Joi.object({
			amount: Joi.number().min(1).required(),
			maxDecrease: Joi.number().min(1).optional(),
		}).optional(),
		decrease: Joi.number().min(1).optional(),
		price: Joi.number().min(1).optional(),
		freeMin: Joi.boolean().optional(),
	})
		.invalid({}, { percentage: {} })
		.optional(),
	description: Joi.string().optional(),
	orderCondition: Joi.object<Condition>({
		minPrice: Joi.number().min(0).optional(),
		minAmount: Joi.number().min(0).optional(),
		orderType: Joi.string()
			.valid(...Object.values(OrderType))
			.optional(),
		includeOne: Joi.array()
			.items(
				Joi.object<IncludeProduct>({
					product: Joi.string().pattern(objectIdPattern),
					sizeKey: Joi.string().optional(),
				})
			)
			.optional(),
		includeAll: Joi.array()
			.items(
				Joi.object<IncludeProduct>({
					product: Joi.string().pattern(objectIdPattern),
					sizeKey: Joi.string().optional(),
				})
			)
			.optional(),
	}).optional(),
	applyTime: Joi.number().min(1).optional(),
})
