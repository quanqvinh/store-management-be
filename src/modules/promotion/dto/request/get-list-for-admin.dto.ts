import { Status } from '@/modules/product/dto/request/get-product-list-admin-filter.dto'
import * as Joi from 'joi'

enum SortBy {
	_id = '_id',
	title = 'title',
	cost = 'cost',
	opening = 'opening',
	deleted = 'deleted',
	coupon = 'coupon',
}

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export class GetPromotionListAdminFilterDto {
	keyword?: string
	status?: Status
	sortBy?: SortBy
	sortOrder?: SortOrder
}

export const GetPromotionListAdminFilterDtoSchema =
	Joi.object<GetPromotionListAdminFilterDto>({
		keyword: Joi.string().min(1).optional(),
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
