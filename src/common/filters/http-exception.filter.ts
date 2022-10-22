import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Response } from 'express'
import { ThrottlerException } from '@nestjs/throttler'
import { TooManyRequestException } from '../exceptions/http'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()

		// Custom Throttler Exception response
		if (exception instanceof ThrottlerException) exception = new TooManyRequestException()

		const status = exception.getStatus()

		response.status(status).json({
			statusCode: status,
			message: exception.message,
			error: exception.name,
			timestamp: new Date().toISOString(),
		})
	}
}
