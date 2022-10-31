import * as Joi from 'joi'
import { PipeTransform, Injectable } from '@nestjs/common'
import { InvalidDataException } from '@/common/exceptions/http/bad-request.exception'
import { usernamePattern } from '../validators'

@Injectable()
export class UsernameValidatePipe implements PipeTransform {
	transform(value: any): string {
		const username = '' + value
		const validator = Joi.string().required().pattern(usernamePattern.normal)
		if (validator.validate(username).error)
			throw new InvalidDataException('Username')
		return username
	}
}
