import * as Joi from 'joi'
import {
	namePattern,
	mobilePattern,
	passwordPattern,
} from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'

export class CreateMemberDto {
	@ApiProperty()
	email: string

	@ApiProperty()
	mobile: string

	@ApiProperty()
	firstName: string

	@ApiProperty()
	lastName: string

	@ApiProperty()
	password: string
}

export const CreateMemberSchema = Joi.object({
	email: Joi.string().email().required(),
	mobile: Joi.string().required().pattern(mobilePattern),
	firstName: Joi.string().required().pattern(namePattern),
	lastName: Joi.string().required().pattern(namePattern),
	password: Joi.string()
		.required()
		.pattern(passwordPattern.amountCharacter(4, 30)),
})
