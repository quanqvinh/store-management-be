import { objectIdPattern } from '@/common/validators'
import { OrderType } from '@/constants'
import {
	Condition,
	IncludeCategoryCondition,
	IncludeProductCondition,
} from '../../schemas/condition.schema'
import { DiscountType } from '../../schemas/discount-type.schema'
import * as Joi from 'joi'
import { Size } from '@/constants'

export class UpdateInfoCouponDto {
	title?: string
	code?: string
	discount?: DiscountType
	description?: string
	orderCondition?: Condition
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
		includeOneCategoryIn: Joi.array()
			.items(
				Joi.object<IncludeCategoryCondition>({
					category: Joi.string().pattern(objectIdPattern).required(),
					size: Joi.number()
						.valid(...Object.values(Size))
						.optional(),
					amount: Joi.number().min(1).default(1).optional(),
				})
			)
			.optional(),
		includeAllCategoryIn: Joi.array()
			.items(
				Joi.object<IncludeCategoryCondition>({
					category: Joi.string().pattern(objectIdPattern).required(),
					size: Joi.number()
						.valid(...Object.values(Size))
						.optional(),
					amount: Joi.number().min(1).default(1).optional(),
				})
			)
			.optional(),
		includeOneProductIn: Joi.array()
			.items(
				Joi.object<IncludeProductCondition>({
					product: Joi.string().pattern(objectIdPattern).optional(),
					size: Joi.number()
						.valid(...Object.values(Size))
						.optional(),
					amount: Joi.number().min(1).default(1).optional(),
				})
			)
			.optional(),
		includeAllProductIn: Joi.array()
			.items(
				Joi.object<IncludeProductCondition>({
					product: Joi.string().pattern(objectIdPattern).optional(),
					size: Joi.number()
						.valid(...Object.values(Size))
						.optional(),
					amount: Joi.number().min(1).default(1).optional(),
				})
			)
			.optional(),
	}).optional(),
	applyTime: Joi.number().min(1).optional(),
})
