import { objectIdPattern } from '@/common/validators'
import { EmployeeRole } from '@/constants'
import * as Joi from 'joi'

export class CreateEmployeeDto {
	username: string
	role: EmployeeRole
	store?: string
}

export const CreateEmployeeDtoSchema = Joi.object<CreateEmployeeDto>({
	username: Joi.string().required(),
	role: Joi.string()
		.valid(...Object.values(EmployeeRole))
		.required(),
	store: Joi.string().pattern(objectIdPattern).when('role', {
		is: EmployeeRole.SALESPERSON,
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
})
