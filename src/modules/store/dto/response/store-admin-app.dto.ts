import { PickType } from '@nestjs/swagger'
import { Store } from '../../schemas/store.schema'

export class StoreAdminApp extends PickType(Store, [
	'_id',
	'name',
	'updatedAt',
]) {
	fullAddress: string
}
