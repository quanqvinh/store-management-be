import { BadRequestException } from '@nestjs/common'

export class InvalidIdentifierException extends BadRequestException {
	constructor() {
		super('Identifier is invalid')
	}
}

export class FailedLoginException extends BadRequestException {
	constructor(identityType = 'Email/Username') {
		super(identityType + ' or password is wrong')
	}
}

export class InvalidDataException extends BadRequestException {
	constructor(fieldName = 'Some fields') {
		super(fieldName + ' is invalid')
	}
}

export class ValidationException extends BadRequestException {
	constructor() {
		super('Validation failed')
	}
}

export class LackOfImageException extends BadRequestException {
	constructor(field: string) {
		super(field + ' image is required')
	}
}
