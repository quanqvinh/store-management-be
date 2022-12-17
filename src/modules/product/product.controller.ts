import {
	DisableProductDto,
	DisableProductDtoSchema,
} from './dto/request/disable-product.dto'
import {
	UpdateProductImageDto,
	UpdateProductImageDtoSchema,
} from './dto/request/update-product-image.dto'
import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFiles,
	UseInterceptors,
	Param,
	Query,
	Patch,
	Delete,
} from '@nestjs/common'
import { ProductService } from './product.service'
import {
	FileFieldsInterceptor,
	FilesInterceptor,
} from '@nestjs/platform-express'
import { JoiValidatePine, ObjectIdValidatePine } from '@/common/pipes'
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
import {
	UpdateProductInfoDto,
	UpdateProductInfoDtoSchema,
} from './dto/request/update-product-info.dto'
import { CategoryService } from '../category/category.service'
import {
	CategoryInShort,
	ProductDetailAdminDto,
} from './dto/response/product-detail-admin.dto'
import { Product } from './schemas/product.schema'

@Controller('product')
@ApiTags('product')
export class ProductController {
	constructor(
		private productService: ProductService,
		private categoryService: CategoryService
	) {}

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

	@Get('admin/:id')
	@SkipThrottle()
	// @Auth(EmployeeRole.ADMIN)
	async getProductDetail(
		@Param('id', ObjectIdValidatePine) productId: string
	): Promise<ProductDetailAdminDto> {
		const productDetail = await this.productService.getDetailForAdminApp(
			productId
		)
		const allCategories: CategoryInShort[] = (
			await this.categoryService.getAll()
		)?.map(
			category =>
				({
					_id: category._id.toString(),
					name: category.name,
					image: category.image,
				} as unknown as CategoryInShort)
		)
		return {
			productDetail,
			allCategories,
		}
	}

	@Patch(':id/update-info')
	// @Auth(EmployeeRole.ADMIN)
	async updateProductInfo(
		@Param('id', ObjectIdValidatePine) productId: string,
		@Body(new JoiValidatePine(UpdateProductInfoDtoSchema))
		updateProductInfoDto: UpdateProductInfoDto
	) {
		return await this.productService.updateProductInfo(
			productId,
			updateProductInfoDto
		)
	}

	@Patch(':id/update-image')
	// @Auth(EmployeeRole.ADMIN)
	@UseInterceptors(FilesInterceptor('newImages'))
	@ApiConsumes('multipart/form-data')
	async updateProductImage(
		@Param('id', ObjectIdValidatePine) productId: string,
		@UploadedFiles() newImages: Array<File>,
		@Body(new JoiValidatePine(UpdateProductImageDtoSchema))
		body: UpdateProductImageDto
	) {
		const newImageIds = newImages.map(file => '' + file.id.toString())
		return await this.productService.updateProductImage(
			productId,
			newImageIds,
			body.deletedImages
		)
	}

	@Patch(':id/disable')
	// @Auth(EmployeeRole.ADMIN)
	async disableProduct(
		@Param('id', ObjectIdValidatePine) productId: string,
		@Query(new JoiValidatePine(DisableProductDtoSchema))
		query: DisableProductDto
	) {
		if (query.instantly === 'true') {
			return await this.productService.disable(productId)
		} else {
			return await this.productService.addDisableFlag(productId, query.timer)
		}
	}

	@Patch(':id/enable')
	// @Auth(EmployeeRole.ADMIN)
	async enableProduct(@Param('id', ObjectIdValidatePine) productId: string) {
		return await this.productService.enable(productId)
	}

	@Delete(':id/destroy')
	// @Auth(EmployeeRole.ADMIN)
	async destroyProduct(@Param('id', ObjectIdValidatePine) productId: string) {
		return await this.productService.destroy(productId)
	}
}
