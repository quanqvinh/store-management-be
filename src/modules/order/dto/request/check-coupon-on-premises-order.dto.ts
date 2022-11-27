import { CreateOrderDto, createOrderDtoSchemaObject } from './create-order.dto'
import * as Joi from 'joi'
import { objectIdPattern } from '@/common/validators'
import { OmitType } from '@nestjs/swagger'

export class CheckCouponOnPremisesOrderDto extends OmitType(CreateOrderDto, [
	'paidAmount',
	'storeId',
]) {
	memberId: string
	couponId: string
}

const customCreateOrderDtoSchemaObject = createOrderDtoSchemaObject

delete customCreateOrderDtoSchemaObject.paidAmount
delete customCreateOrderDtoSchemaObject.storeId

export const CheckCouponOnPremisesOrderDtoSchema =
	Joi.object<CheckCouponOnPremisesOrderDto>({
		...customCreateOrderDtoSchemaObject,
		memberId: Joi.string().pattern(objectIdPattern).required(),
		couponId: Joi.string().pattern(objectIdPattern).required(),
	})
