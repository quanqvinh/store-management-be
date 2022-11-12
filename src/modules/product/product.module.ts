import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { Product, ProductSchema } from './schemas/product.schema'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ConfigModule } from '@nestjs/config'
import { DatabaseConnectionName } from '@/constants'
import { PortalMulterModule } from '../file/file.module'
import { CategoryModule } from '../category/category.module'
import { SettingModule } from '../setting/setting.module'
import { StoreModule } from '../store/store.module'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Product.name, schema: ProductSchema }],
			DatabaseConnectionName.DATA
		),
		CategoryModule,
		ConfigModule,
		SettingModule,
		StoreModule,
		PortalMulterModule,
	],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService],
})
export class ProductModule {}
