import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { Product, ProductSchema } from './schemas/product.schema'
import { ProductController } from './controllers/product.controller'
import { CategoryController } from './controllers/category.controller'
import { CategoryService } from './services/category.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
	],
	controllers: [ProductController, CategoryController],
	providers: [CategoryService],
	exports: [],
})
export class ProductModule {}
