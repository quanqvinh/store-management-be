import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { ObjectSchema } from 'joi'

@Injectable()
export default class JoiValidatePine implements PipeTransform {
	constructor(private schema: ObjectSchema) {}

	transform(value: any) {
		const { error } = this.schema.validate(value)
		if (error)
			throw new BadRequestException(error.details.map(detail => detail.message))
		return value
	}
}
