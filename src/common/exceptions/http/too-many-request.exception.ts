import { HttpException } from '@nestjs/common'

export class TooManyRequestException extends HttpException {
	constructor() {
		super('Too many request', 429)
	}
}
