import * as Joi from 'joi'
import { PipeTransform, Injectable } from '@nestjs/common'
import { InvalidDataException } from '@/common/exceptions/http/bad-request.exception'

@Injectable()
export class UsernameValidatePipe implements PipeTransform {
	transform(value: any): string {
		const username = '' + value
		const validator = Joi.string().required().pattern(/\w+/)
		if (validator.validate(username).error) throw new InvalidDataException('Username')
		return username
	}
}
