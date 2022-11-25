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

export class NotImageFileException extends BadRequestException {
	constructor(mimetype?: string) {
		super(
			'Only accept image files' +
				(mimetype ? ` (${mimetype} type is sent)` : '')
		)
	}
}

export class DataNotChangeException extends BadRequestException {
	constructor(field = 'data') {
		super(`Data is not change or ${field} is not found`)
	}
}

export class CannotUseCouponException extends BadRequestException {
	constructor(reason?: string) {
		super(`Cannot use coupon` + (reason ? ` (${reason})` : ''))
	}
}
