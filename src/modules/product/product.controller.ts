import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFiles,
	UseInterceptors,
	Param,
} from '@nestjs/common'
import { ProductService } from './product.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { JoiValidatePine, ObjectIdValidatePine } from '@/common/pipes'
import {
	CreateProductDto,
	CreateProductDtoSchema,
} from './dto/request/create-product.dto'
import { File } from '@/types'
import { ApiConsumes, ApiTags } from '@nestjs/swagger'

@Controller('product')
@ApiTags('product')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Get('category/all')
	async getAll() {
		return await this.productService.getAllOfStoreInMemberApp()
	}

	@Get('category/:storeId')
	async getAllOfStore(@Param('storeId', ObjectIdValidatePine) storeId: string) {
		return await this.productService.getAllOfStoreInMemberApp(storeId)
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
}
