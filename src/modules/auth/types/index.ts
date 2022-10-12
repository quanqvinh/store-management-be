import { ApiProperty } from '@nestjs/swagger'
export class TokenData {
	@ApiProperty()
	access_token: string

	@ApiProperty()
	refresh_token: string
}
