import { GetStoreListAdminFilterDto } from './dto/request/get-list-store-admin-filter.dto'
import { GetStoreListAdminFilterDtoSchema } from './dto/request/get-list-store-admin-filter.dto'
import {
	UpdateStoreImageDto,
	UpdateStoreImageDtoSchema,
} from './dto/request/update-store-image.dto'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { StoreService } from './store.service'
import { File } from '@/types'
import { JoiValidatePine, ObjectIdValidatePine } from '@/common/pipes'
import {
	CreateStoreDto,
	CreateStoreDtoSchema,
} from './dto/request/create-store.dto'
import { GeneralService } from '../setting/services/general.service'
import { StoreMemberAppDto } from './dto/response/store-member-app.dto'
import { ApiConsumes, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import {
	UpdateStoreInfoDto,
	UpdateStoreInfoDtoSchema,
} from './dto/request/update-store-info.dto'
import {
	DisableStoreDto,
	DisableStoreDtoSchema,
} from './dto/request/disable-store.dto'
import { Auth } from '@/common/decorators/auth.decorator'
import { EmployeeRole } from '@/constants'

@Controller('store')
@ApiTags('store')
export class StoreController {
	constructor(
		private storeService: StoreService,
		private generalSetting: GeneralService
	) {}

	@Get('member-app/all')
	@SkipThrottle()
	async getAllStoresInMemberApp(): Promise<StoreMemberAppDto[]> {
		const generalSetting = await this.generalSetting.get(
			'storeContact brandName'
		)
		const stores = await this.storeService.getAllForMember()
		return stores.map(store => ({
			...store,
			id: undefined,
			contact: generalSetting.storeContact,
			brandName: generalSetting.brandName,
		})) as unknown as StoreMemberAppDto[]
	}

	@Get('admin-app/list')
	@SkipThrottle()
	// @Auth(EmployeeRole.ADMIN)
	async getAllStoresInAdminApp(
		@Query(new JoiValidatePine(GetStoreListAdminFilterDtoSchema))
		query: GetStoreListAdminFilterDto
	) {
		return await this.storeService.getAllForAdmin(query)
	}

	@Get('admin-app/:id/detail')
	@SkipThrottle()
	// @Auth(EmployeeRole.ADMIN)
	async getStoreDetailInAdminApp(
		@Param('id', ObjectIdValidatePine) storeId: string
	) {
		return await this.storeService.getDetailForAdmin(storeId)
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

	@Patch(':id/update-info')
	// @Auth(EmployeeRole.ADMIN)
	async updateStoreInfo(
		@Param('id', ObjectIdValidatePine) storeId: string,
		@Body(new JoiValidatePine(UpdateStoreInfoDtoSchema))
		body: UpdateStoreInfoDto
	) {
		return await this.storeService.updateStoreInfo(storeId, body)
	}

	@Patch(':id/update-image')
	// @Auth(EmployeeRole.ADMIN)
	@UseInterceptors(FilesInterceptor('newImages'))
	@ApiConsumes('multipart/form-data')
	async updateStoreImage(
		@Param('id', ObjectIdValidatePine) storeId: string,
		@UploadedFiles() newImages: Array<File>,
		@Body(new JoiValidatePine(UpdateStoreImageDtoSchema))
		body: UpdateStoreImageDto
	) {
		const newImageIds = newImages.map(file => '' + file.id.toString())
		return await this.storeService.updateStoreImage(
			storeId,
			newImageIds,
			body.deletedImages
		)
	}

	@Post(':id/update-image')
	// @Auth(EmployeeRole.ADMIN)
	@UseInterceptors(FilesInterceptor('newImages'))
	@ApiConsumes('multipart/form-data')
	async updateStoreImage_test(
		@Param('id', ObjectIdValidatePine) storeId: string,
		@UploadedFiles() newImages: Array<File>,
		@Body(new JoiValidatePine(UpdateStoreImageDtoSchema))
		body: UpdateStoreImageDto
	) {
		const newImageIds = newImages.map(file => '' + file.id.toString())
		return await this.storeService.updateStoreImage(
			storeId,
			newImageIds,
			body.deletedImages
		)
	}

	@Patch(':id/disable')
	// @Auth(EmployeeRole.ADMIN)
	async disableProduct(
		@Param('id', ObjectIdValidatePine) storeId: string,
		@Query(new JoiValidatePine(DisableStoreDtoSchema))
		query: DisableStoreDto
	) {
		if (query.instantly === 'true') {
			return await this.storeService.disable(storeId)
		} else {
			return await this.storeService.addDisableFlag(storeId, query.timer)
		}
	}

	@Patch(':id/enable')
	// @Auth(EmployeeRole.ADMIN)
	async enableStore(@Param('id', ObjectIdValidatePine) storeId: string) {
		return await this.storeService.enable(storeId)
	}

	@Delete(':id/destroy')
	// @Auth(EmployeeRole.ADMIN)
	async destroyStore(@Param('id', ObjectIdValidatePine) storeId: string) {
		return await this.storeService.destroy(storeId)
	}
}
