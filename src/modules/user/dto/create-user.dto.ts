import * as Joi from 'joi'

export class CreateUserDto {
	email: string
	avatar: string
	firstName: string
	lastName: string
	displayName: string
	mobile: string
	password: string
}

export const CreateUserSchema = Joi.object({
	email: Joi.string().email().required(),
	avatar: Joi.string().uri(),
	firstName: Joi.string()
		.required()
		.pattern(new RegExp(/[a-zA-Z]+/)),
	lastName: Joi.string()
		.required()
		.pattern(new RegExp(/[a-zA-Z]+/)),
	displayName: Joi.string().pattern(new RegExp(/[a-zA-Z]+/)),
	mobile: Joi.string().pattern(new RegExp(/^\+?\d+$/)),
	password: Joi.string(),
}).options({
	abortEarly: false,
})
