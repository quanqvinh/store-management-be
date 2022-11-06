import { Module } from '@nestjs/common'
import { FileController } from './files.controller'
import { GridFsConfigService } from './services/grid-fs-config.service'
import { FileService } from './services/file.service'

@Module({
	imports: [],
	controllers: [FileController],
	providers: [GridFsConfigService, FileService],
	exports: [GridFsConfigService, FileService],
})
export class FileModule {}
