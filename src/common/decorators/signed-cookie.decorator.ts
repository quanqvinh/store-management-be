import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const SignedCookie = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		console.log(request.csrfToken())
		return request.signedCookies
	}
)
