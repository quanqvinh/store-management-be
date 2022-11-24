import { SetMetadata } from '@nestjs/common'
import { EmployeeRole } from '@/constants'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: EmployeeRole[]) => SetMetadata(ROLES_KEY, roles)
