import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFiles,
	UseInterceptors,
	Param,
	Query,
} from '@nestjs/common'
import { ProductService } from './product.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { JoiValidatePine } from '@/common/pipes'
import {
	CreateProductDto,
	CreateProductDtoSchema,
} from './dto/request/create-product.dto'
import { File } from '@/types'
import { ApiConsumes, ApiTags } from '@nestjs/swagger'
import { IdAndSlugValidatePine } from '@/common/pipes/id-and-slug-validate.pipe'
import { checkObjectId } from '@/utils'
import { SkipThrottle } from '@nestjs/throttler'
import { Auth } from '@/common/decorators/auth.decorator'
import { EmployeeRole } from '@/constants'
import { EmployeeAuth, User } from '@/common/decorators'
import {
	GetProductListAdminFilterDto,
	GetProductListAdminFilterDtoSchema,
} from './dto/request/get-product-list-admin-filter.dto'

@Controller('product')
@ApiTags('product')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Get('category/all')
	@SkipThrottle()
	async getAll() {
		return await this.productService.getAllOfStoreInMemberApp({})
	}

	@Get('category/store')
	@Auth(EmployeeRole.SALESPERSON)
	async getAllOfStoreByJwt(@User() employee: EmployeeAuth) {
		return await this.productService.getAllOfStoreInMemberApp({
			id: employee.store,
		})
	}

	@Get('category/:storeId')
	@SkipThrottle()
	async getAllOfStore(
		@Param('storeId', IdAndSlugValidatePine) storeId: string
	) {
		return await this.productService.getAllOfStoreInMemberApp(
			checkObjectId(storeId) ? { id: storeId } : { slug: storeId }
		)
	}

	@Post('create')
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 4 }]))
	@ApiConsumes('multipart/form-data')
	async create(
		@UploadedFiles()
		{
			images,
		}: {
			images?: Array<File>
		},
		@Body(new JoiValidatePine(CreateProductDtoSchema))
		createProductDto: CreateProductDto
	) {
		return await this.productService.create(
			createProductDto,
			images?.map(image => image.id)
		)
	}

	@Get('admin/list')
	@SkipThrottle()
	// @Auth(EmployeeRole.ADMIN)
	async getProductListForAdminApp(
		@Query(new JoiValidatePine(GetProductListAdminFilterDtoSchema))
		query: GetProductListAdminFilterDto
	) {
		return await this.productService.getListForAdminApp(query)
	}
}
