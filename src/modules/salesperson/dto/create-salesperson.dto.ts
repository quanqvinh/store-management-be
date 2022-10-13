import * as Joi from 'joi'
import Pattern from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'

export class CreateSalespersonDto {
	@ApiProperty()
	email: string

	@ApiProperty()
	username: string

	@ApiProperty()
	firstName: string

	@ApiProperty()
	lastName: string

	@ApiProperty()
	password: string
}

export const CreateSalespersonSchema = Joi.object({
	email: Joi.string().email().required(),
	username: Joi.string()
		.required()
		.pattern(Pattern.username.hasLetter)
		.pattern(Pattern.username.normal),
	firstName: Joi.string().required().pattern(Pattern.name),
	lastName: Joi.string().required().pattern(Pattern.name),
	password: Joi.string()
		.required()
		.pattern(Pattern.password.amountCharacter(4, 30)),
})
