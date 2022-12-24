import * as Joi from 'joi'

enum BooleanString {
	TRUE = 'true',
	FALSE = 'false',
}

export class DisablePromotionDto {
	instantly?: BooleanString
	timer?: number
}

export const DisablePromotionDtoSchema = Joi.object({
	instantly: Joi.boolean().default(true).optional(),
	timer: Joi.number()
		.min(Date.now() + 60000)
		.optional(),
})
