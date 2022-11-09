import { Injectable, PipeTransform } from '@nestjs/common'
import { Types } from 'mongoose'
import { InvalidDataException } from '../exceptions/http'

@Injectable()
export class ObjectIdValidatePine implements PipeTransform {
	transform(value: any): string {
		console.log(value)
		const id = '' + value
		try {
			const objectId = new Types.ObjectId(id)
			if (id === objectId.toString()) return id
			else throw null
		} catch {
			throw new InvalidDataException('ID')
		}
	}
}
