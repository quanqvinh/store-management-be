import { ProductItemForAdmin } from '../response/product-admin-app.dto'
import * as Joi from 'joi'
import { objectIdPattern } from '@/common/validators'

export class GetProductListAdminFilterDto {
	category?: string
	sortBy?: Exclude<keyof ProductItemForAdmin, 'mainImage'>
}

export const GetProductListAdminFilterDtoSchema =
	Joi.object<GetProductListAdminFilterDto>({
		category: Joi.string().pattern(objectIdPattern).optional(),
		sortBy: Joi.string()
			.valid(...Object.keys(new ProductItemForAdmin()))
			.invalid('mainImage')
			.optional(),
	})
