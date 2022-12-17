import * as Joi from 'joi'

enum BooleanString {
	TRUE = 'true',
	FALSE = 'false',
}

export class DisableStoreDto {
	instantly: BooleanString
	timer?: number
}

export const DisableStoreDtoSchema = Joi.object({
	instantly: Joi.boolean().default(true).required(),
	timer: Joi.number()
		.min(Date.now() + 60000)
		.optional(),
})
