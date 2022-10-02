import { PipeTransform, Injectable } from '@nestjs/common'
import { ObjectSchema } from 'joi'

@Injectable()
export class JoiValidatePine implements PipeTransform {
	constructor(private schema: ObjectSchema) {}

	transform(value: any) {
		const { error } = this.schema.validate(value)
		if (error) throw error
		return value
	}
}
