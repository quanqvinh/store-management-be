import { OmitType } from '@nestjs/swagger'
import { CreateOrderDto, createOrderDtoSchemaObject } from './create-order.dto'
import * as Joi from 'joi'
import { objectIdPattern } from '@/common/validators'

export class CreateOrderBySalespersonDto extends OmitType(CreateOrderDto, [
	'storeId',
]) {
	memberId?: string
	// memberCode?: string
	// couponCode?: string
	couponId?: string
}

const customCreateOrderDtoSchema = Object.assign({}, createOrderDtoSchemaObject)
delete customCreateOrderDtoSchema.storeId

export const CreateOrderBySalespersonDtoSchema =
	Joi.object<CreateOrderBySalespersonDto>({
		...customCreateOrderDtoSchema,
		memberId: Joi.string().pattern(objectIdPattern).optional(),
		couponId: Joi.string().pattern(objectIdPattern).optional(),
		// memberCode: Joi.string()
		// 	.pattern(new RegExp(/^[A-Z][0-9]+$/))
		// 	.optional(),
		// couponCode: Joi.string()
		// 	.pattern(new RegExp(/^[A-Z0-9]+$/))
		// 	.optional(),
	})
