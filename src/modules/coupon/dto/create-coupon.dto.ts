import {
	FreeMinIn,
	NewPriceDiscount,
	Percentage,
} from './../schemas/discount-type.schema'
import { objectIdPattern } from '@/common/validators'
import { OrderType, Size } from '@/constants'
import {
	Condition,
	IncludeCategoryCondition,
	IncludeProductCondition,
} from './../schemas/condition.schema'
import { DiscountType } from '../schemas/discount-type.schema'
import * as Joi from 'joi'
import { PartialType } from '@nestjs/swagger'

export class PartialDiscountType extends PartialType(DiscountType) {}
export class PartialCondition extends PartialType(Condition) {}

export class CreateCouponDto {
	title: string
	code: string
	discount: DiscountType
	description?: string
	orderCondition?: Condition
	amountApplyHour: number
}

export const CreateCouponDtoSchema = Joi.object<CreateCouponDto>({
	title: Joi.string().required(),
	code: Joi.string().token().required(),
	discount: Joi.object<DiscountType>({
		percentage: Joi.object<Percentage>({
			amount: Joi.number().min(1).max(100).required(),
			maxDecrease: Joi.number().min(1).optional(),
		}).optional(),
		decrease: Joi.number().min(1).optional(),
		price: Joi.array()
			.items(
				Joi.object<NewPriceDiscount>({
					product: Joi.string().pattern(objectIdPattern).required(),
					size: Joi.number()
						.valid(...Object.values(Size))
						.required(),
					amount: Joi.number().min(1).optional(),
					newPrice: Joi.number().min(0).required(),
				})
			)
			.optional(),
		freeMin: Joi.object<FreeMinIn>({
			amount: Joi.number().min(1).default(1).required(),
			all: Joi.boolean().default(false).optional(),
			products: Joi.array()
				.items(Joi.string().pattern(objectIdPattern))
				.min(1)
				.optional(),
			category: Joi.string().pattern(objectIdPattern).optional(),
		}).optional(),
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
	amountApplyHour: Joi.number().min(1).required(),
})
