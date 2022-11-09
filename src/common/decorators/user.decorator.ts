import { EmployeeRole } from '@/constants'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export type MemberAuth = {
	id: string
}

export type EmployeeAuth = {
	id: string
	role?: EmployeeRole
}

export const User = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): MemberAuth | EmployeeAuth => {
		const request = ctx.switchToHttp().getRequest()
		return request.user
	}
)
