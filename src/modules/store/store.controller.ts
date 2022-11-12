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
import { GeneralService } from '../setting/services/general.service'
import { StoreMemberAppDto } from './dto/response/store-member-app.dto'
import { ApiConsumes, ApiTags } from '@nestjs/swagger'

@Controller('store')
@ApiTags('store')
export class StoreController {
	constructor(
		private storeService: StoreService,
		private generalSetting: GeneralService
	) {}

	@Get('/member-app/all')
	async getAllStoresInMemberApp(): Promise<StoreMemberAppDto> {
		const generalSetting = await this.generalSetting.get(
			'storeContact brandName'
		)
		const stores = await this.storeService.getAllForMember()
		return stores.map(store => ({
			...store,
			id: undefined,
			contact: generalSetting.storeContact,
			brandName: generalSetting.brandName,
		})) as unknown as StoreMemberAppDto
	}

	@Post('create')
	@UseInterceptors(FilesInterceptor('images'))
	@ApiConsumes('multipart/form-data')
	async create(
		@UploadedFiles() files: Array<File>,
		@Body(new JoiValidatePine(CreateStoreDtoSchema))
		createStoreDto: CreateStoreDto
	) {
		return this.storeService.create(createStoreDto, files)
	}
}
