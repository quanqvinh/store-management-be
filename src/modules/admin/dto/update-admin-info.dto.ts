import Pattern from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'
import { Gender } from '@/constants'
import * as Joi from 'joi'

export class UpdateAdminInfoDto {
	@ApiProperty()
	email: string

	@ApiProperty()
	username: string

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

export const UpdateAdminInfoSchema = Joi.object({
	email: Joi.string().email().optional(),
	username: Joi.string().optional().pattern(Pattern.username.hasLetter),
	avatar: Joi.string().uri().optional(),
	firstName: Joi.string().optional().pattern(Pattern.name),
	lastName: Joi.string().optional().pattern(Pattern.name),
	gender: Joi.string().optional(),
	dob: Joi.string().optional(),
})
