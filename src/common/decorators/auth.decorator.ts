import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAccessGuard } from '../guards/jwt-auth.guard'
import { RolesGuard } from '../guards/roles.guard'
import { ApiBearerAuth } from '@nestjs/swagger'
import { EmployeeRole } from '@/constants'
import { Roles } from './roles.decorator'

export function Auth(...roles: EmployeeRole[]) {
	return applyDecorators(
		Roles(...roles),
		UseGuards(JwtAccessGuard, RolesGuard),
		ApiBearerAuth()
	)
}
