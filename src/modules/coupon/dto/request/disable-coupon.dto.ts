import * as Joi from 'joi'

enum BooleanString {
	TRUE = 'true',
	FALSE = 'false',
}

export class DisableCouponDto {
	instantly?: BooleanString
	timer?: number
}

export const DisableCouponDtoSchema = Joi.object({
	instantly: Joi.boolean().default(true).optional(),
	timer: Joi.number()
		.min(Date.now() + 60000)
		.optional(),
})
