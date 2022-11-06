import { PipeTransform, Injectable } from '@nestjs/common'
import { ObjectSchema } from 'joi'

@Injectable()
export class JoiValidatePine implements PipeTransform {
	constructor(private schema: ObjectSchema) {}

	transform(value: any) {
		// Convert JSON strings to its right type
		// for (const key in value) {
		// 	if (key.includes('otp')) continue
		// 	try {
		// 		const result = JSON.parse(value[key])
		// 		value[key] = result
		// 	} catch {
		// 		continue
		// 	}
		// }
		const { error } = this.schema.validate(value)
		if (error) throw error
		return value
	}
}
