import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { FileController } from './files.controller'
import { GridFsConfigService } from './services/grid-fs-config.service'
import { ConfigModule } from '@nestjs/config'
import { FileService } from './services/file.service'

@Module({
	imports: [
		ConfigModule,
		MulterModule.registerAsync({
			useClass: GridFsConfigService,
		}),
	],
	controllers: [FileController],
	providers: [GridFsConfigService, FileService],
	exports: [GridFsConfigService, FileService],
})
export class FileModule {}
