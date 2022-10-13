import Pattern from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'
import { Gender } from '@/constants'
import * as Joi from 'joi'

export class UpdateSalespersonInfoDto {
	@ApiProperty({ required: false })
	email: string

	@ApiProperty({ required: false })
	username: string

	@ApiProperty({ required: false })
	avatar: string

	@ApiProperty({ required: false })
	firstName: string

	@ApiProperty({ required: false })
	lastName: string

	@ApiProperty({ required: false })
	gender: Gender

	@ApiProperty({ required: false })
	dob: Date
}

export const UpdateSalespersonInfoSchema = Joi.object({
	email: Joi.string().email().optional(),
	username: Joi.string()
		.required()
		.pattern(Pattern.username.hasLetter)
		.pattern(Pattern.username.normal),
	avatar: Joi.string().uri().optional(),
	firstName: Joi.string().optional().pattern(Pattern.name),
	lastName: Joi.string().optional().pattern(Pattern.name),
	password: Joi.string()
		.optional()
		.pattern(Pattern.password.amountCharacter(4, 30)),
})
