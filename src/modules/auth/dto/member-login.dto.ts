import { ApiProperty } from '@nestjs/swagger'

export class MemberLoginDto {
	@ApiProperty({ description: 'Email, username or mobile' })
	identifier: string

	@ApiProperty()
	password: string
}
