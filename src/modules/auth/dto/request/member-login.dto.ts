import * as Joi from 'joi'

export class MemberLoginDto {
	/**
	 * @example example@gmail.com
	 */
	email: string
}

export const MemberLoginDtoSchema = Joi.object<MemberLoginDto>({
	email: Joi.string().email().required(),
})
