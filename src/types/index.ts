import { EmployeeRole } from '@/constants/index'
import { HttpException, HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class JwtPayload {
	sub: string
	aud: string
	exp: number
	iat: number
	role?: EmployeeRole
}

export class ResponseData<T> {
	data: T
}

export type ChangeFields<T, R> = Omit<T, keyof R> & R

export class WriteResponse {
	@ApiProperty()
	isSuccess: boolean
}

export class ExceptionResponse<T extends HttpException> {
	@ApiProperty()
	statusCode: HttpStatus
	@ApiProperty()
	message: T['message']
	@ApiProperty()
	error: T['name']
	@ApiProperty()
	timestamp: string
}
