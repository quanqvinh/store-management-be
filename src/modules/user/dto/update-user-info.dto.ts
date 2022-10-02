import Pattern from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'
import * as Joi from 'joi'

export class UpdateUserInfoDto {
	@ApiProperty({ required: false })
	email?: string

	@ApiProperty({ required: false })
	avatar?: string

	@ApiProperty({ required: false })
	firstName?: string

	@ApiProperty({ required: false })
	lastName?: string

	@ApiProperty({ required: false })
	displayName?: string

	@ApiProperty({ required: false })
	mobile?: string

	@ApiProperty({ required: false })
	username?: string

	@ApiProperty({ required: false })
	password?: string

	@ApiProperty({ required: false })
	dob?: Date

	@ApiProperty({ required: false })
	bio?: string

	@ApiProperty({ required: false })
	address?: string

	@ApiProperty({ required: false })
	city?: string

	@ApiProperty({ required: false })
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
