import * as Joi from 'joi'
import Pattern from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
	@ApiProperty()
	email: string

	@ApiProperty()
	avatar: string

	@ApiProperty()
	firstName: string

	@ApiProperty()
	lastName: string

	@ApiProperty()
	displayName: string

	@ApiProperty()
	mobile: string

	@ApiProperty()
	password: string
}

export const CreateUserSchema = Joi.object({
	email: Joi.string().email().required(),
	avatar: Joi.string().uri(),
	firstName: Joi.string().required().pattern(Pattern.name),
	lastName: Joi.string().required().pattern(Pattern.name),
	displayName: Joi.string().pattern(Pattern.displayName),
	mobile: Joi.string().pattern(Pattern.mobile),
	password: Joi.string().pattern(Pattern.password.amountCharacter(4, 30)),
})
