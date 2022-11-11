import { Controller } from '@nestjs/common'
// import { CategoryService } from '@/modules/product/services/category.service'
import { ProductService } from '@/modules/product/product.service'
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator'
import { FileService } from '../file/services/file.service'
import { StoreService } from '../store/store.service'

@Controller('cleaner')
export class CleanerController {
	constructor(
		private productService: ProductService,
		// private categoryService: CategoryService,
		private fileService: FileService,
		private storeService: StoreService
	) {}

	// @Get('files')
	// async cleanUnusedFiles() {
	// 	try {
	// 		const categoryImages = (await this.categoryService.getAll()).map(
	// 			category => category.image.toString()
	// 		)
	// 		const productImages = (await this.productService.getAll()).reduce(
	// 			(result, product) => {
	// 				return [...result, ...product.images]
	// 			},
	// 			[]
	// 		)
	// 		const storeImages = (await this.storeService.getAllForMember()).reduce(
	// 			(result, store) => [...result, ...store.images],
	// 			[]
	// 		)
	// 		const allFiles = (await this.fileService.getMany()).map(file =>
	// 			file._id.toString()
	// 		)
	// 		const set = new Set<string>()
	// 		categoryImages.forEach(image => set.add(image))
	// 		productImages.forEach(image => set.add(image))
	// 		storeImages.forEach(image => set.add(image))

	// 		const deleteList = allFiles.filter(id => !set.has(id))

	// 		await this.fileService.deleteMany(deleteList)

	// 		return { success: true, deletedCount: deleteList.length }
	// 	} catch {
	// 		return { success: false }
	// 	}
	// }
}
