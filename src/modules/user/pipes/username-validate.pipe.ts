import * as Joi from 'joi'
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

@Injectable()
export default class UsernameValidatePipe implements PipeTransform {
	transform(value: any): string {
		const username = '' + value
		const validator = Joi.string().required().pattern(/\w+/)
		if (validator.validate(username).error)
			throw new BadRequestException('Username is wrong')
		return username
	}
}
