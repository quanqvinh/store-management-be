import { JoiValidatePine, IdAndSlugValidatePine } from '@/common/pipes'
import { File } from '@/types'
import { checkObjectId } from '@/utils'
import {
	Body,
	Controller,
	Get,
	Post,
	UseInterceptors,
	UploadedFile,
	Param,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { CategoryService } from './category.service'
import {
	CreateCategoryDto,
	CreateCategoryDtoSchema,
} from './dto/create-category.dto'

@Controller('category')
@ApiTags('category')
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get('all')
	@SkipThrottle()
	async getAllCategories() {
		return await this.categoryService.getAll()
	}

	@Get(':id')
	@SkipThrottle()
	async getOneCategory(@Param('id', IdAndSlugValidatePine) categoryId: string) {
		return await this.categoryService.getOne(
			checkObjectId(categoryId) ? { id: categoryId } : { slug: categoryId }
		)
	}

	@Post()
	@UseInterceptors(FileInterceptor('image'))
	@ApiConsumes('multipart/form-data')
	async createNew(
		@UploadedFile() file: File,
		@Body(new JoiValidatePine(CreateCategoryDtoSchema))
		createCategoryDto: CreateCategoryDto
	) {
		return await this.categoryService.create(
			createCategoryDto,
			file?.id?.toString()
		)
	}
}
