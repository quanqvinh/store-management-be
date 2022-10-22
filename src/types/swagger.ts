import { HttpException, HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

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
