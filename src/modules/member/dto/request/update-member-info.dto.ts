import {
	mobilePattern,
	namePattern,
	passwordPattern,
} from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'
import { Gender } from '@/constants'
import * as Joi from 'joi'

export class UpdateMemberInfoDto {
	@ApiProperty({ required: false })
	email: string

	@ApiProperty({ required: false })
	mobile: string

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

export const UpdateMemberInfoSchema = Joi.object({
	email: Joi.string().email().optional(),
	mobile: Joi.string().optional().pattern(mobilePattern),
	avatar: Joi.string().uri().optional(),
	firstName: Joi.string().optional().pattern(namePattern),
	lastName: Joi.string().optional().pattern(namePattern),
	password: Joi.string()
		.optional()
		.pattern(passwordPattern.amountCharacter(4, 30)),
})
