import { checkObjectId } from '@/utils'
import { Injectable, PipeTransform } from '@nestjs/common'
import { InvalidDataException } from '../exceptions/http'

@Injectable()
export class ObjectIdValidatePine implements PipeTransform {
	transform(value: any): string {
		const id = '' + value
		try {
			if (checkObjectId(id)) return id
			else throw null
		} catch {
			throw new InvalidDataException('ID')
		}
	}
}
