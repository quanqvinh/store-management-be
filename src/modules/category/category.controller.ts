import { JoiValidatePine } from '@/common/pipes'
import { File } from '@/types'
import {
	Body,
	Controller,
	Get,
	Post,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CategoryService } from './category.service'
import {
	CreateCategoryDto,
	CreateCategoryDtoSchema,
} from './dto/create-category.dto'

@Controller('category')
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get('all')
	async getAllCategories() {
		return await this.categoryService.getAll()
	}

	@Post()
	@UseInterceptors(FileInterceptor('image'))
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
