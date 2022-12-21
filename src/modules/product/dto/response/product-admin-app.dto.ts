import { ProductWithVirtuals } from './../../schemas/product.schema'
import { PickType } from '@nestjs/swagger'
import { ObjectId } from 'mongoose'

export class ProductItemForAdmin extends PickType(ProductWithVirtuals, [
	'_id',
	'name',
	'originalPrice',
	'mainImage',
	'deleted',
	'deletedAt',
]) {
	saleOfWeek?: number
	changedAmount?: number
	categoryName: string
	categoryId: string
}

export class ProductInOrders {
	_id: ObjectId | string
	amountOneWeekAgo: number
	amountTwoWeekAgo: number
}
