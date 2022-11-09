import { Module } from '@nestjs/common'
import { FileController } from './files.controller'
import { GridFsConfigService } from './services/grid-fs-config.service'
import { FileService } from './services/file.service'
import { MulterModule } from '@nestjs/platform-express'

@Module({
	imports: [
		MulterModule.registerAsync({
			useClass: GridFsConfigService,
		}),
	],
	controllers: [FileController],
	providers: [GridFsConfigService, FileService],
	exports: [GridFsConfigService, FileService],
})
export class FileModule {}

export const PortalMulterModule = MulterModule.registerAsync({
	imports: [FileModule],
	useExisting: GridFsConfigService,
})
