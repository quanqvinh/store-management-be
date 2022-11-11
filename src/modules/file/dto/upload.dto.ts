import {
	ApiPropertyFile,
	ApiPropertyMultiFiles,
} from '@/common/decorators/file-swagger.decorator'

export class FileUploadDto {
	@ApiPropertyFile()
	photo: any
}

export class MultiFileUploadDto {
	@ApiPropertyMultiFiles()
	photos: Array<any>
}
