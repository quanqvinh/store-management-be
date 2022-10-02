import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const status = exception.getStatus()

		response.status(status).json({
			statusCode: status,
			message: exception.message,
			error: exception.name,
			timestamp: new Date().toISOString(),
		})
	}
}