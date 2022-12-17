import { PickType } from '@nestjs/swagger'
import { Store } from '../../schemas/store.schema'

export class SaleData {
	totalAmount: number
	totalPrice: number
}

export class StoreSaleData {
	_id: string
	weekOne: SaleData
	weekTwo: SaleData
}

export class StoreSaleThisTime {
	saleAmountOfWeek: number
	changeAmountOfWeek: number
	salePriceOfWeek: number
	changePriceOfWeek: number
}

export class StoreItemForAdminDto extends PickType(Store, [
	'_id',
	'name',
	'updatedAt',
]) {
	mainImage: string
	fullAddress: string
	sale: StoreSaleThisTime
}
