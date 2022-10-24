import { Controller, Get } from '@nestjs/common'
import { CategoryDto } from '../dto/response/category.dto'
import { CategoryService } from '../services/category.service'

@Controller('product-category')
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get('all')
	async getList(): Promise<CategoryDto[]> {
		return await this.categoryService.getProductCategories()
	}
}
