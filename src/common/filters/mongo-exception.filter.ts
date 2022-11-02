import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Response } from 'express'
import { MongoException } from '../exceptions/mongo.exception'

@Catch(MongoException)
export class MongoExceptionFilter implements ExceptionFilter {
	catch(exception: MongoException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const status = exception.httpCode

		response.status(status).json({
			statusCode: status,
			message: exception.message,
			error: exception.name,
			timestamp: new Date().toISOString(),
		})
	}
}
