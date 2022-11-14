import { checkObjectId } from '@/utils'
import { Injectable, PipeTransform } from '@nestjs/common'
import { InvalidDataException } from '../exceptions/http'
import { slugPattern } from '../validators'

@Injectable()
export class IdAndSlugValidatePine implements PipeTransform {
	transform(value: any): string {
		const id = '' + value
		try {
			if (checkObjectId(id)) return id
			if (slugPattern.test(id)) return id
			throw null
		} catch {
			throw new InvalidDataException('ID or slug')
		}
	}
}
