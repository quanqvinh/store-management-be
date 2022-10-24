import * as Joi from 'joi'
import Pattern from '@/common/validators'
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
	mobile: Joi.string().required().pattern(Pattern.mobile),
	firstName: Joi.string().required().pattern(Pattern.name),
	lastName: Joi.string().required().pattern(Pattern.name),
	password: Joi.string()
		.required()
		.pattern(Pattern.password.amountCharacter(4, 30)),
})
