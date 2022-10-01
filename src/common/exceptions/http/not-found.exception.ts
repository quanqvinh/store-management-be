import { NotFoundException } from '@nestjs/common'

export class NotFoundDataException extends NotFoundException {
	constructor(documentName = 'Document') {
		super(documentName.trim() + ' not found')
	}
}

export class NotMatchedDataException extends NotFoundException {
	constructor() {
		super('Not matched any data')
	}
}
