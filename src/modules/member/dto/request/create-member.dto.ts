import * as coreJoi from 'joi'
import * as joiDate from '@joi/date'
import { namePattern, mobilePattern } from '@/common/validators'
import { Gender } from '@/constants'

const Joi = coreJoi.extend(joiDate.default(coreJoi)) as typeof coreJoi

export class CreateMemberDto {
	email: string
	mobile: string
	firstName: string
	lastName: string
	dob: string
	gender: Gender
}

export const CreateMemberDtoSchema = Joi.object({
	email: Joi.string().email().required(),
	mobile: Joi.string().required().pattern(mobilePattern),
	firstName: Joi.string().required().pattern(namePattern),
	lastName: Joi.string().required().pattern(namePattern),
	dob: Joi.date().max('now').format('YYYY-MM-DD').required(),
	gender: Joi.string()
		.valid(...Object.values(Gender))
		.required(),
})
