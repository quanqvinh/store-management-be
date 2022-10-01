import {
	ForbiddenException,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'

export class ReusedTokenException extends ForbiddenException {
	constructor() {
		super('Force login')
	}
}

export class NotFoundUserException extends NotFoundException {
	constructor() {
		super('User not found')
	}
}

export class InvalidRefreshTokenException extends ForbiddenException {
	constructor() {
		super('Refresh token is invalid')
	}
}

export class NotModifiedDataException extends InternalServerErrorException {
	constructor() {
		super('Data is not modified')
	}
}

export class InvalidIdentityException extends UnauthorizedException {
	constructor() {
		super('Identity is invalid')
	}
}

export class FailedLoginException extends UnauthorizedException {
	constructor(identityType = 'Email/Username') {
		super(identityType + ' or password is wrong')
	}
}
