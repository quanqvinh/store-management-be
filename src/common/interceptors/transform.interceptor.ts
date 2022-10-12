import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
	data: T
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler
	): Observable<any> | Promise<Observable<any>> {
		return next.handle().pipe(map(data => ({ data })))
	}
}
