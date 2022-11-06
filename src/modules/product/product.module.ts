import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { Product, ProductSchema } from './schemas/product.schema'
import { ProductController } from './controllers/product.controller'
import { CategoryController } from './controllers/category.controller'
import { CategoryService } from './services/category.service'
import { ProductService } from './services/product.service'
import { ConfigModule } from '@nestjs/config'
import { DatabaseConnectionName } from '@/constants'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Product.name, schema: ProductSchema }],
			DatabaseConnectionName.DATA
		),
		ConfigModule,
	],
	controllers: [ProductController, CategoryController],
	providers: [CategoryService, ProductService],
	exports: [CategoryService, ProductService],
})
export class ProductModule {}
