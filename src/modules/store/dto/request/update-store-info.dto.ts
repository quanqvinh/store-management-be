import { objectIdPattern } from '@/common/validators'
import { PickType } from '@nestjs/swagger'
import * as Joi from 'joi'
import { Address, DailyTime, Store, Time } from '../../schemas/store.schema'

export class UpdateStoreInfoDto extends PickType(Store, [
	'name',
	'dailyTime',
	'address',
	'unavailableProducts',
]) {}

export const UpdateStoreInfoDtoSchema = Joi.object<UpdateStoreInfoDto>({
	name: Joi.string().optional(),
	dailyTime: Joi.object<DailyTime>({
		open: Joi.object<Time>({
			hour: Joi.number().min(0).max(23).required(),
			minute: Joi.number().min(0).max(59).required(),
		}),
		close: Joi.object<Time>({
			hour: Joi.number().min(0).max(23).required(),
			minute: Joi.number().min(0).max(59).required(),
		}),
	}).optional(),
	address: Joi.object<Address>({
		street: Joi.string().required(),
		ward: Joi.string().min(0).optional(),
		district: Joi.string().required(),
		city: Joi.string().required(),
		country: Joi.string().required(),
	}).optional(),
	unavailableProducts: Joi.array()
		.items(Joi.string().pattern(objectIdPattern))
		.optional(),
}).min(1)
