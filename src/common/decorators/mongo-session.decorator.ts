import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { ClientSession } from 'mongoose'

export const MongoSession = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): ClientSession => {
		const request = ctx.switchToHttp().getRequest()
		return request['session']
	}
)
