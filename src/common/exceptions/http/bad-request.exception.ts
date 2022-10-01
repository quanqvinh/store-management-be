import { BadRequestException } from '@nestjs/common'

export class InvalidIdentityException extends BadRequestException {
	constructor() {
		super('Identity is invalid')
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
