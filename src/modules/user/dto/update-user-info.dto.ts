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
	email: Joi.string().email(),
	avatar: Joi.string().uri(),
	firstName: Joi.string(),
	lastName: Joi.string(),
	displayName: Joi.string(),
	mobile: Joi.string(),
	username: Joi.string(),
	password: Joi.string(),
	dob: Joi.string(),
	bio: Joi.string(),
	address: Joi.string(),
	city: Joi.string(),
	country: Joi.string(),
})
