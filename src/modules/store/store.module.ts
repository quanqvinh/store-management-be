import { DatabaseConnectionName } from '@/constants'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'
import { FileModule } from '../file/file.module'
import { GridFsConfigService } from '../file/services/grid-fs-config.service'
import { Store, StoreSchema } from './schemas/store.schema'
import { StoreController } from './store.controller'
import { StoreService } from './store.service'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Store.name, schema: StoreSchema }],
			DatabaseConnectionName.DATA
		),
		MulterModule.registerAsync({
			imports: [FileModule],
			useExisting: GridFsConfigService,
		}),
	],
	controllers: [StoreController],
	providers: [StoreService],
	exports: [StoreService],
})
export class StoreModule {}
