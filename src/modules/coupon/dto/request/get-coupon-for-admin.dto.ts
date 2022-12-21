import { Status } from '@/modules/product/dto/request/get-product-list-admin-filter.dto'
import * as Joi from 'joi'

enum SortBy {
	_id = '_id',
	title = 'title',
	code = 'code',
	amountApplyHour = 'amountApplyHour',
	deleted = 'deleted',
}

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export class GetCouponListAdminFilterDto {
	keyword?: string
	status?: Status
	sortBy?: SortBy
	sortOrder?: SortOrder
}

export const GetCouponListAdminFilterDtoSchema =
	Joi.object<GetCouponListAdminFilterDto>({
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
