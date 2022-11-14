import { ApiPropertyMultiFiles } from '@/common/decorators/file-swagger.decorator'
import * as Joi from 'joi'
import { Address, DailyTime, Time } from '../schemas/store.schema'

export class CreateStoreDto {
	@ApiPropertyMultiFiles()
	images?: Array<any>
	name: string
	dailyTime: DailyTime
	address: Address
}

export const CreateStoreDtoSchema = Joi.object<CreateStoreDto>({
	name: Joi.string().required(),
	dailyTime: Joi.object<DailyTime>({
		open: Joi.object<Time>({
			hour: Joi.number().min(0).max(23).required(),
			minute: Joi.number().min(0).max(59).required(),
		}),
		close: Joi.object<Time>({
			hour: Joi.number().min(0).max(23).required(),
			minute: Joi.number().min(0).max(59).required(),
		}),
	}).required(),
	address: Joi.object<Address>({
		street: Joi.string().required(),
		ward: Joi.string().optional(),
		district: Joi.string().required(),
		city: Joi.string().required(),
		country: Joi.string().required(),
	}).required(),
})
