import { UserRole } from '@/constants/index'
import { ApiProperty } from '@nestjs/swagger'

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

export type ChangeFields<T, R> = Omit<T, keyof R> & R

export class WriteResponse {
	@ApiProperty()
	isSuccess: boolean
}
