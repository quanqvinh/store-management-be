import { UserRole } from '@/constants/index'
export class JwtPayload {
	sub: string
	aud: string
	role: UserRole
	exp: number
	iat: number
}

export class ResponseData<T> {
	data: T
}
