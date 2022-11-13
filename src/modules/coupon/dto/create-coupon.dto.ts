import { objectIdPattern } from '@/common/validators/regex'
import { OrderType, Size } from '@/constants'
import { Condition, IncludeProduct } from './../schemas/condition.schema'
import { DiscountType } from '../schemas/discount-type.schema'
import * as Joi from 'joi'

export class CreateCouponDto {
	title: string
	code: string
	discount: Partial<DiscountType>
	description?: string
	orderCondition?: Partial<Condition>
	applyTime: number
}

export const CreateCouponDtoSchema = Joi.object<CreateCouponDto>({
	title: Joi.string().required(),
	code: Joi.string().token().required(),
	discount: Joi.object<DiscountType>({
		percentage: Joi.object({
			amount: Joi.number().min(1).max(100).required(),
			maxDecrease: Joi.number().min(1).optional(),
		}).optional(),
		decrease: Joi.number().min(1).optional(),
		price: Joi.number().min(1).optional(),
		freeMin: Joi.boolean().optional(),
	})
		.invalid({}, { percentage: {} })
		.required(),
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
					size: Joi.string()
						.valid(...Object.values(Size))
						.optional(),
					amount: Joi.number().min(1).default(1).optional(),
				})
			)
			.optional(),
		includeAll: Joi.array()
			.items(
				Joi.object<IncludeProduct>({
					product: Joi.string().pattern(objectIdPattern),
					size: Joi.string()
						.valid(...Object.values(Size))
						.optional(),
					amount: Joi.number().min(1).default(1).optional(),
				})
			)
			.optional(),
	}).optional(),
	applyTime: Joi.number().min(1).required(),
})
