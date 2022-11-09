import { PipeTransform, Injectable } from '@nestjs/common'
import { ObjectSchema } from 'joi'

@Injectable()
export class JoiValidatePine implements PipeTransform {
	constructor(private schema: ObjectSchema) {}

	private convertJsonToRightType(data: any) {
		for (const key in data) {
			if (key.includes('otp')) continue
			try {
				const result = JSON.parse(data[key])
				if (typeof result === 'object') data[key] = result
			} catch {
				continue
			}
		}
		return data
	}

	transform(value: any) {
		// Convert JSON of object to object
		value = this.convertJsonToRightType(value)

		const { error } = this.schema.validate(value)
		if (error) throw error
		return value
	}
}
