import { PickType } from '@nestjs/swagger'
import { Store } from '../../schemas/store.schema'

export class StoreMemberAppDto extends PickType(Store, [
	'_id',
	'images',
	'dailyTime',
	'address',
] as const) {
	contact: string
	brandName: string
	mainImage: string
	addressName: string
}
