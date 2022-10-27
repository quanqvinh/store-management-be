import {
	Controller,
	Get,
	Param,
	Query,
	Post,
	Res,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
	Delete,
} from '@nestjs/common'
import { FileService } from './services/file.service'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { ObjectIdValidatePine, ObjectIdListValidatePine } from '@/common/pipes'

type File = Express.Multer.File

@Controller('file')
export class FileController {
	constructor(private fileService: FileService) {}

	@Post('multi-upload')
	@UseInterceptors(FilesInterceptor('photos'))
	multiUpload(@UploadedFiles() files: Array<File>) {
		return files
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('photo'))
	upload(@UploadedFile() file: File) {
		return file
	}

	@Get('render/:id')
	async renderFile(
		@Param('id', ObjectIdValidatePine) fileId: string,
		@Res() res: Response
	) {
		await this.fileService.render(fileId, res)
	}

	@Get('info/multi')
	async getInfoMulti(
		@Query('id', ObjectIdListValidatePine) fileIds: Array<string>
	) {
		return fileIds
	}

	@Get('info/:id')
	async getInfo(@Param('id', ObjectIdValidatePine) fileId: string) {
		return await this.fileService.getOne(fileId)
	}

	@Delete('delete/multi')
	async deleteMulti(
		@Query('id', ObjectIdListValidatePine) fileIds: Array<string>
	) {
		return await this.fileService.deleteMany(fileIds)
	}

	@Delete('delete/:id')
	async delete(@Param('id', ObjectIdValidatePine) fileId: string) {
		return await this.fileService.deleteOne(fileId)
	}
}
