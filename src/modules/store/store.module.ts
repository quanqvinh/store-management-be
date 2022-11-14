import { DatabaseConnectionName } from '@/constants'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PortalMulterModule } from '../file/file.module'
import { SettingModule } from '../setting/setting.module'
import { Store, StoreSchema } from './schemas/store.schema'
import { StoreController } from './store.controller'
import { StoreService } from './store.service'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Store.name, schema: StoreSchema }],
			DatabaseConnectionName.DATA
		),
		PortalMulterModule,
		SettingModule,
	],
	controllers: [StoreController],
	providers: [StoreService],
	exports: [StoreService, MongooseModule],
})
export class StoreModule {}
