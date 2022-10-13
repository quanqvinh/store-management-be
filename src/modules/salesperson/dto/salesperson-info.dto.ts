import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Salesperson } from '../schemas/salesperson.schema'

export class SalespersonInfoDto extends OmitType(Salesperson, [
	'auth',
] as const) {
	@ApiProperty()
	isVerified: boolean
}
