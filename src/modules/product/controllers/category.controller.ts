import { Controller, Get } from '@nestjs/common'
import { Category } from '../schemas/category.schema'
import { CategoryService } from '../services/category.service'

@Controller('product-category')
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get('all')
	async getList(): Promise<Category[]> {
		return await this.categoryService.getAll()
	}
}
