import * as Joi from 'joi'
import { PipeTransform, Injectable } from '@nestjs/common'
import { InvalidDataException } from '@/common/exceptions/http/bad-request.exception'

@Injectable()
export class EmailValidatePipe implements PipeTransform {
	transform(value: any): string {
		const email = '' + value
		const validator = Joi.string().email().required()
		if (validator.validate(email).error) throw new InvalidDataException('Email')
		return email
	}
}
