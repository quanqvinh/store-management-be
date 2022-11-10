import { objectIdPattern } from '@/common/validators'
import { ApplyCouponType, CouponSource, CycleType } from '@/constants'
import * as Joi from 'joi'

export class CreateAppliedCouponDto {
	couponId: string
	type: ApplyCouponType
	cycleType?: CycleType
	source?: CouponSource
	startTime: number
}

export const CreateAppliedCouponDtoSchema = Joi.object<CreateAppliedCouponDto>({
	couponId: Joi.string().pattern(objectIdPattern).required(),
	type: Joi.string()
		.valid(...Object.values(ApplyCouponType))
		.required(),
	cycleType: Joi.string()
		.valid(...Object.values(CycleType))
		.when('type', {
			is: Joi.valid(ApplyCouponType.ONCE),
			then: Joi.optional(),
			otherwise: Joi.required(),
		}),
	source: Joi.string()
		.valid(...Object.values(CouponSource))
		.default(CouponSource.AUTO_SYSTEM)
		.optional(),
	startTime: Joi.number().min(0).required().custom((value, helpers): number => +value),
})
