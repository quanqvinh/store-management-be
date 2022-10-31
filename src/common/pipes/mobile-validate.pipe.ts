import * as Joi from 'joi'
import { PipeTransform, Injectable } from '@nestjs/common'
import { InvalidDataException } from '@/common/exceptions/http/bad-request.exception'
import { mobilePattern } from '@/common/validators'

@Injectable()
export class MobileValidatePipe implements PipeTransform {
	transform(value: any): string {
		const mobile = '' + value
		const validator = Joi.string().required().pattern(mobilePattern)
		if (validator.validate(mobile).error)
			throw new InvalidDataException('Mobile')
		return mobile
	}
}
