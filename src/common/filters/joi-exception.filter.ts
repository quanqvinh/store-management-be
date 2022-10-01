import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { ValidationError } from 'joi'
import { Response } from 'express'

@Catch(ValidationError)
export default class JoiExceptionFilter implements ExceptionFilter {
	catch(exception: ValidationError, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const status = 400

		response.status(status).json({
			statusCode: status,
			message: exception.details.map(error => error.message),
			error: exception.name,
			timestamp: new Date().toISOString(),
		})
	}
}
