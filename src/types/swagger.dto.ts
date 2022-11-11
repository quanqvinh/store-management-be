import { HttpException, HttpStatus } from '@nestjs/common'

export class SuccessResponse {
	success: boolean
}

export class ExceptionResponse<T extends HttpException> {
	statusCode: HttpStatus
	message: T['message']
	error: T['name']
	timestamp: string
}
