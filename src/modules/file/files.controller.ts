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
import { File } from '@/types'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileUploadDto, MultiFileUploadDto } from './dto/upload.dto'
import { SkipThrottle } from '@nestjs/throttler'

@Controller('file')
@ApiTags('file')
export class FileController {
	constructor(private fileService: FileService) {}

	@Post('multi-upload')
	@UseInterceptors(FilesInterceptor('photos'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({ type: MultiFileUploadDto })
	multiUpload(@UploadedFiles() files: Array<File>) {
		return files
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('photo'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({ type: FileUploadDto })
	upload(@UploadedFile() file: File) {
		return file
	}

	@Get('render/:id')
	@SkipThrottle()
	async renderFile(
		@Param('id', ObjectIdValidatePine) fileId: string,
		@Res() res: Response
	) {
		await this.fileService.render(fileId, res)
	}

	@Get('info/multi')
	@SkipThrottle()
	async getInfoMulti(
		@Query('id', ObjectIdListValidatePine) fileIds: Array<string>
	) {
		return this.fileService.getMany(fileIds)
	}

	@Get('info/all')
	@SkipThrottle()
	async getInfoAll() {
		return this.fileService.getMany()
	}

	@Get('info/:id')
	@SkipThrottle()
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
