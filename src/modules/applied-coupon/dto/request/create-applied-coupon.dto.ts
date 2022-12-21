import { objectIdPattern } from '@/common/validators'
import { ApplyCouponType, CouponSource, CycleType } from '@/constants'
import { ApiProperty } from '@nestjs/swagger'
import * as Joi from 'joi'

export class CreateAppliedCouponDto {
	applyTo?: Array<string>
	couponId: Array<string>
	type: ApplyCouponType
	cycleType?: CycleType
	@ApiProperty({ example: CouponSource.MANUAL })
	source?: CouponSource
	startTime: number
}

export const CreateAppliedCouponDtoSchema = Joi.object<CreateAppliedCouponDto>({
	applyTo: Joi.array()
		.items(Joi.string().pattern(objectIdPattern))
		.min(1)
		.required(),
	couponId: Joi.array()
		.items(Joi.string().pattern(objectIdPattern))
		.min(1)
		.required(),
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
	startTime: Joi.number().min(0).required(),
})
