import { NotificationContent } from '@/modules/notification/schemas/notification.schema'
import * as Joi from 'joi'

export class UpdateNotificationCouponDto {
	notification: NotificationContent
}

export const UpdateNotificationCouponDtoSchema =
	Joi.object<UpdateNotificationCouponDto>({
		notification: Joi.object<NotificationContent>({
			title: Joi.string().required(),
			content: Joi.string().required(),
		})
			.invalid({})
			.required(),
	})
