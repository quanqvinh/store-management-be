import { DatabaseConnectionName } from '@/constants'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PortalMulterModule } from '../file/file.module'
import { SettingModule } from '../setting/setting.module'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { Category, CategorySchema } from './schemas/category.schema'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Category.name, schema: CategorySchema }],
			DatabaseConnectionName.DATA
		),
		SettingModule,
		PortalMulterModule,
	],
	controllers: [CategoryController],
	providers: [CategoryService],
	exports: [CategoryService, MongooseModule],
})
export class CategoryModule {}
