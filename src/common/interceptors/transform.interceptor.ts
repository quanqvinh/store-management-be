import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler
	): Observable<any> | Promise<Observable<any>> {
		const requestMethod = context.switchToHttp().getRequest<Request>().method

		if (['OPTIONS', 'HEAD'].includes(requestMethod)) return next.handle()

		return next.handle().pipe(
			map(data => {
				if (requestMethod === 'GET') return { data }
				else return { success: !!data }
			})
		)
	}
}
