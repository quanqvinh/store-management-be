import * as Joi from 'joi'
import { objectIdPattern } from '@/common/validators'

enum SortBy {
	_id = '_id',
	name = 'name',
	originalPrice = 'originalPrice',
	updatedAt = 'updatedAt',
	saleOfWeek = 'saleOfWeek',
	changedAmount = 'changedAmount',
	categoryName = 'categoryName',
}

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export enum Status {
	DISABLED = 'disabled',
	ENABLE = 'enable',
	ALL = 'all',
}

export class GetProductListAdminFilterDto {
	keyword?: string
	category?: string
	status?: Status
	sortBy?: SortBy
	sortOrder?: SortOrder
}

export const GetProductListAdminFilterDtoSchema =
	Joi.object<GetProductListAdminFilterDto>({
		keyword: Joi.string().min(1).optional(),
		category: Joi.string().pattern(objectIdPattern).optional(),
		status: Joi.string()
			.valid(...Object.values(Status))
			.optional(),
		sortBy: Joi.string()
			.valid(...Object.values(SortBy))
			.optional(),
		sortOrder: Joi.string()
			.valid(...Object.values(SortOrder))
			.optional(),
	})
