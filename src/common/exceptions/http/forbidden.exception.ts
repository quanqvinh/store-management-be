import { ForbiddenException } from '@nestjs/common'

export class ReusedTokenException extends ForbiddenException {
	constructor() {
		super('Force login')
	}
}

export class DetectedAbnormalLoginException extends ForbiddenException {
	constructor() {
		super('Detected an abnormal login')
	}
}

export class InvalidRefreshTokenException extends ForbiddenException {
	constructor() {
		super('Refresh token is invalid')
	}
}
