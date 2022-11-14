import { NotFoundDataException } from '@/common/exceptions/http'
import { CreateCategoryDto } from './dto/create-category.dto'
import { DatabaseConnectionName } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category, CategoryDocument } from './schemas/category.schema'
import { MemberAppService } from '../setting/services/member-app.service'

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel(Category.name, DatabaseConnectionName.DATA)
		private readonly categoryModel: Model<CategoryDocument>,
		private memberAppService: MemberAppService
	) {}

	async getAll(): Promise<Category[]> {
		return await this.categoryModel.find().sort('-hot order').lean().exec()
	}

	async getOne({
		id,
		slug,
	}: {
		id?: string
		slug?: string
	}): Promise<Category> {
		return await this.categoryModel
			.findOne({ $or: [{ slug }, { _id: id }] })
			.orFail(new NotFoundDataException('Category'))
			.lean()
			.exec()
	}

	async create(
		dto: CreateCategoryDto,
		imageId: string | undefined
	): Promise<Category> {
		const [[maxOrderCategory], { defaultImages }] = await Promise.all([
			this.categoryModel.find().sort('-order').limit(1).lean().exec(),
			this.memberAppService.get('defaultImages'),
		])

		return await this.categoryModel.create({
			name: dto.name,
			type: dto.type,
			image: imageId ?? defaultImages.category.toString(),
			order: maxOrderCategory?.order ? maxOrderCategory.order + 1 : 0,
		})
	}
}
