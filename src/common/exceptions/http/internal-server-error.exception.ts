import { InternalServerErrorException } from '@nestjs/common'

export class NotModifiedDataException extends InternalServerErrorException {
	constructor() {
		super('Data is not modified')
	}
}

export class NotSavedDataException extends InternalServerErrorException {
	constructor() {
		super('Data is not saved')
	}
}
