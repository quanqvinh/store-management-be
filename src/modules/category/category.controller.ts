import { JoiValidatePine, ObjectIdValidatePine } from '@/common/pipes'
import { File } from '@/types'
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
	async getAllCategories() {
		return await this.categoryService.getAll()
	}

	@Get(':id')
	async getOneCategory(@Param('id', ObjectIdValidatePine) categoryId: string) {
		return await this.categoryService.getOne(categoryId)
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
