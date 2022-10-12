import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
	@ApiProperty({ description: 'Email, username or mobile' })
	identifier: string

	@ApiProperty()
	password: string
}
