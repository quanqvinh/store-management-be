import {
	ProductActionTimer,
	ProductActionTimerSchema,
} from './schemas/product-action-timer.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { Product, ProductSchema } from './schemas/product.schema'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ConfigModule } from '@nestjs/config'
import { DatabaseConnectionName } from '@/constants'
import { FileModule, PortalMulterModule } from '../file/file.module'
import { CategoryModule } from '../category/category.module'
import { SettingModule } from '../setting/setting.module'
import { StoreModule } from '../store/store.module'
import { Order, OrderSchema } from '../order/schemas'
import { ProductStream } from './auto/product.stream'

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: Product.name, schema: ProductSchema },
				{ name: Order.name, schema: OrderSchema },
				{
					name: ProductActionTimer.name,
					schema: ProductActionTimerSchema,
				},
			],
			DatabaseConnectionName.DATA
		),
		CategoryModule,
		ConfigModule,
		SettingModule,
		StoreModule,
		FileModule,
		PortalMulterModule,
	],
	controllers: [ProductController],
	providers: [ProductService, ProductStream],
	exports: [ProductService],
})
export class ProductModule {}
