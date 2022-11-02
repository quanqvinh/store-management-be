import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { StoreService } from './store.service'
import { File } from '@/types'
import { JoiValidatePine } from '@/common/pipes'
import { CreateStoreDto, CreateStoreDtoSchema } from './dto/create-store.dto'

@Controller('store')
export class StoreController {
	constructor(private storeService: StoreService) {}

	@Get('/member/all')
	async getAllStores() {
		return await this.storeService.getAllForMember()
	}

	@Post('create')
	@UseInterceptors(FilesInterceptor('images'))
	async create(
		@UploadedFiles() files: Array<File>,
		@Body(new JoiValidatePine(CreateStoreDtoSchema))
		createStoreDto: CreateStoreDto
	) {
		return this.storeService.create(createStoreDto, files)
	}
}
