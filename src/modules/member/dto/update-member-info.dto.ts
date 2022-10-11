import Pattern from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'
import { Gender } from '@/constants'
import * as Joi from 'joi'

export class UpdateMemberInfoDto {
	@ApiProperty()
	email: string

	@ApiProperty()
	mobile: string

	@ApiProperty()
	avatar: string

	@ApiProperty()
	firstName: string

	@ApiProperty()
	lastName: string

	@ApiProperty()
	gender: Gender

	@ApiProperty()
	dob: Date
}

export const UpdateMemberInfoSchema = Joi.object({
	email: Joi.string().email().optional(),
	mobile: Joi.string().optional().pattern(Pattern.mobile),
	avatar: Joi.string().uri().optional(),
	firstName: Joi.string().optional().pattern(Pattern.name),
	lastName: Joi.string().optional().pattern(Pattern.name),
	password: Joi.string()
		.optional()
		.pattern(Pattern.password.amountCharacter(4, 30)),
})
