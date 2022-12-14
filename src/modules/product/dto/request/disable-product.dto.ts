import * as Joi from 'joi'

enum BooleanString {
	TRUE = 'true',
	FALSE = 'false',
}

export class DisableProductDto {
	instantly: BooleanString
	timer?: number
}

export const DisableProductDtoSchema = Joi.object({
	instantly: Joi.boolean().default(true).required(),
	timer: Joi.number()
		.min(Date.now() + 60000)
		.optional(),
})
