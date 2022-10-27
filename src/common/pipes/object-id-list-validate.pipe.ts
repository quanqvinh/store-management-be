import { Injectable, PipeTransform } from '@nestjs/common'
import { Types } from 'mongoose'
import { InvalidDataException } from '../exceptions/http'

@Injectable()
export class ObjectIdListValidatePine implements PipeTransform {
	transform(
		value: Array<string | Types.ObjectId>
	): Array<string | Types.ObjectId> {
		let errorId
		try {
			const isValidAll = value.every(id => {
				errorId = id
				if (id === new Types.ObjectId(id).toString()) return true
				return false
			})
			if (!isValidAll) throw null
			return value
		} catch {
			throw new InvalidDataException('ID' + (errorId ? ' ' + errorId : ''))
		}
	}
}
