import Pattern from '@/common/validators'
import * as Joi from 'joi'

export class UpdateUserInfoDto {
	email?: string
	avatar?: string
	firstName?: string
	lastName?: string
	displayName?: string
	mobile?: string
	username?: string
	password?: string
	dob?: Date
	bio?: string
	address?: string
	city?: string
	country?: string
}

export const UpdateUserSchema = Joi.object({
	email: Joi.string().email().required(),
	avatar: Joi.string().uri(),
	firstName: Joi.string().required().pattern(Pattern.name),
	lastName: Joi.string().required().pattern(Pattern.name),
	displayName: Joi.string().pattern(Pattern.displayName),
	mobile: Joi.string().pattern(Pattern.mobile),
	username: Joi.string()
		.pattern(Pattern.username.normal)
		.pattern(Pattern.username.normal),
	password: Joi.string()
		.pattern(Pattern.password.minCharacter(4))
		.pattern(Pattern.password.maxCharacter(30)),
	dob: Joi.string(),
	bio: Joi.string(),
	address: Joi.string(),
	city: Joi.string(),
	country: Joi.string(),
})
