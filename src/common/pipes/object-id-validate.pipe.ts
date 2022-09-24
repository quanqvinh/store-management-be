import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'
import { Types } from 'mongoose'

@Injectable()
export default class ObjectIdValidatePine implements PipeTransform {
	transform(value: any): string {
		const id = '' + value
		try {
			const objectId = new Types.ObjectId(id)
			if (id === objectId.toString()) return id
			else throw null
		} catch {
			throw new BadRequestException('Id is invalid')
		}
	}
}
