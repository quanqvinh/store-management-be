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
	sortBy?: SortBy
	sortOrder?: SortOrder
}

export const GetCouponListAdminFilterDtoSchema =
	Joi.object<GetCouponListAdminFilterDto>({
		keyword: Joi.string().min(1).optional(),
		sortBy: Joi.string()
			.valid(...Object.values(SortBy))
			.optional(),
		sortOrder: Joi.string()
			.valid(...Object.values(SortOrder))
			.optional(),
	})
