import * as Joi from 'joi'

export class EmployeeLoginDto {
	username: string
	password: string
}

export const EmployeeLoginDtoSchema = Joi.object<EmployeeLoginDto>({
	username: Joi.string().required(),
	password: Joi.string().required(),
})
