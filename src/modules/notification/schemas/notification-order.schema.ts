import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, ObjectId, Document } from 'mongoose'
import { Notification } from './notification.schema'
import { NotificationType } from '@/constants'

export type NotificationOrderDocument = NotificationOrder & Document

@Schema({ versionKey: false })
export class NotificationOrder extends Notification {
	@Prop({ type: String, default: NotificationType.ORDER })
	type: NotificationType.ORDER

	@Prop({ type: Types.ObjectId, ref: 'Order' })
	orderId: ObjectId
}

export const NotificationOrderSchema =
	SchemaFactory.createForClass(NotificationOrder)
