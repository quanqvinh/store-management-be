import { DatabaseConnectionName } from '@/constants'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FileModule, PortalMulterModule } from '../file/file.module'
import { SettingModule } from '../setting/setting.module'
import { StoreStream } from './auto/store.stream'
import {
	StoreActionTimer,
	StoreActionTimerSchema,
} from './schemas/store-action-timer.schema'
import { Store, StoreSchema } from './schemas/store.schema'
import { StoreController } from './store.controller'
import { StoreService } from './store.service'
import { Order, OrderSchema } from '../order/schemas'
import { Product, ProductSchema } from '../product/schemas/product.schema'

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: Store.name, schema: StoreSchema },
				{ name: Order.name, schema: OrderSchema },
				{ name: Product.name, schema: ProductSchema },
				{ name: StoreActionTimer.name, schema: StoreActionTimerSchema },
			],
			DatabaseConnectionName.DATA
		),
		PortalMulterModule,
		SettingModule,
		FileModule,
	],
	controllers: [StoreController],
	providers: [StoreService, StoreStream],
	exports: [StoreService, MongooseModule],
})
export class StoreModule {}
