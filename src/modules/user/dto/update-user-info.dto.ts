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
	email: Joi.string().email().optional(),
	avatar: Joi.string().uri().optional(),
	firstName: Joi.string().pattern(Pattern.name).optional(),
	lastName: Joi.string().pattern(Pattern.name).optional(),
	displayName: Joi.string().pattern(Pattern.displayName).optional(),
	mobile: Joi.string().pattern(Pattern.mobile).optional(),
	username: Joi.string()
		.pattern(Pattern.username.normal)
		.pattern(Pattern.username.hasLetter)
		.optional(),
	password: Joi.string()
		.pattern(Pattern.password.amountCharacter(4, 30))
		.optional(),
	dob: Joi.string().optional(),
	bio: Joi.string().optional(),
	address: Joi.string().optional(),
	city: Joi.string().optional(),
	country: Joi.string().optional(),
})
