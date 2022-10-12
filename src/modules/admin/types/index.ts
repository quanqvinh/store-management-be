import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Admin } from '../schemas/admin.schema'

export class AdminInfoResponse extends OmitType(Admin, ['auth'] as const) {
	@ApiProperty()
	isVerified: boolean
}
