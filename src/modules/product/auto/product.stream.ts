import {
	ProductActionTimer,
	ProductActionTimerDocument,
} from './../schemas/product-action-timer.schema'
import { DatabaseConnectionName } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Product, ProductDocument } from '../schemas/product.schema'
import { ChangeStreamDocument } from 'mongodb'
import { ProductService } from '../product.service'

@Injectable()
export class ProductStream {
	constructor(
		@InjectModel(Product.name, DatabaseConnectionName.DATA)
		private readonly productModel: Model<ProductDocument>,
		@InjectModel(ProductActionTimer.name, DatabaseConnectionName.DATA)
		private readonly productActionTimerModel: Model<ProductActionTimerDocument>,
		private productService: ProductService
	) {
		this.watchStream()
	}

	private watchStream() {
		this.productActionTimerModel
			.watch()
			.on('change', async (data: ChangeStreamDocument) => {
				if (data.operationType === 'delete') {
					const disableStatus = await this.productService.disable(
						data.documentKey._id?.toString(),
						true
					)
					if (disableStatus) {
						console.log('Disable product successful!')
					} else {
						console.log('Disable product failed!')
					}
				}
			})
	}
}
