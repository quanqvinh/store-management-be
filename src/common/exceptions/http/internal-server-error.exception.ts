import { InternalServerErrorException } from '@nestjs/common'

export class NotModifiedDataException extends InternalServerErrorException {
	constructor() {
		super('Data is not modified')
	}
}

export class NotCreatedDataException extends InternalServerErrorException {
	constructor() {
		super('Data is not created')
	}
}
