import * as Joi from 'joi'
import Pattern from '@/common/validators'

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
	firstName: Joi.string().required().pattern(Pattern.name),
	lastName: Joi.string().required().pattern(Pattern.name),
	displayName: Joi.string().pattern(Pattern.displayName),
	mobile: Joi.string().pattern(Pattern.mobile),
	password: Joi.string()
		.pattern(Pattern.password.minCharacter(4))
		.pattern(Pattern.password.maxCharacter(30)),
})
