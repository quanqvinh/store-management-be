import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { FileController } from './files.controller'
import { GridFsConfigService } from './services/grid-fs-config.service'
import { ConfigModule } from '@nestjs/config'
import { FileService } from './services/file.service'
import { envConfigLoad } from '@/config/env.config'
import { STORAGE_CONNECTION_NAME } from '@/constants'

@Module({
	imports: [
		ConfigModule,
		MulterModule.registerAsync({
			useClass: GridFsConfigService,
		}),
		MongooseModule.forRoot(envConfigLoad().mongo.storageUrl, {
			connectionName: STORAGE_CONNECTION_NAME,
		}),
	],
	controllers: [FileController],
	providers: [GridFsConfigService, FileService],
	exports: [],
})
export class FileModule {}
