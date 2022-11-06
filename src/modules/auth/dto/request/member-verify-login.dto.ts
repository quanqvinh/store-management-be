import { otpPattern } from '@/common/validators'
import * as Joi from 'joi'

export class MemberVerifyLoginDto {
	email: string
	otp: string
}

export const MemberVerifyLoginDtoSchema = Joi.object<MemberVerifyLoginDto>({
	email: Joi.string().email().required(),
	otp: Joi.string().pattern(otpPattern).required(),
})
