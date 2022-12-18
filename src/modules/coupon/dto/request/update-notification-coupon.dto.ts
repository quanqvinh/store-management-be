import { NotificationContent } from '@/modules/notification/schemas/notification.schema'
import * as Joi from 'joi'

export class UpdateNotificationCouponDto extends NotificationContent {}

export const UpdateNotificationCouponDtoSchema =
	Joi.object<UpdateNotificationCouponDto>({
		title: Joi.string().min(3).required(),
		content: Joi.string().min(3).required(),
	})
