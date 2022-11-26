import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { MongoException } from '../exceptions/mongo.exception'
import { Error } from 'mongoose'

@Catch(MongoException, Error.ValidationError)
export class MongoExceptionFilter implements ExceptionFilter {
	catch(exception: MongoException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const status = exception.httpCode ?? HttpStatus.BAD_REQUEST

		response.status(status).json({
			statusCode: status,
			message: exception.message,
			error: exception.name,
			timestamp: new Date().toISOString(),
		})
	}
}
