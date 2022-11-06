import * as Joi from 'joi'

export class MemberLoginDto {
	email: string
}

export const MemberLoginDtoSchema = Joi.object<MemberLoginDto>({
	email: Joi.string().email().required(),
})
