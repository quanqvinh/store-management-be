import {
	Catch,
	ExceptionFilter,
	ArgumentsHost,
	HttpStatus,
} from '@nestjs/common'
import { ValidationError } from 'joi'
import { Response } from 'express'

@Catch(ValidationError)
export class JoiExceptionFilter implements ExceptionFilter {
	catch(exception: ValidationError, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const status = HttpStatus.BAD_REQUEST

		response.status(status).json({
			statusCode: status,
			message: exception.details.reduce(
				(result, error) => result + error.message,
				''
			),
			error: exception.name,
			timestamp: new Date().toISOString(),
		})
	}
}
