import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, ObjectId, Document } from 'mongoose'
import { Notification } from './notification.schema'
import { NotificationType } from '@/constants'

export type NotificationCouponDocument = NotificationCoupon & Document

@Schema({ versionKey: false })
export class NotificationCoupon extends Notification {
	@Prop({ type: String, default: NotificationType.COUPON })
	type: NotificationType.COUPON

	@Prop({ type: Types.ObjectId, ref: 'ApplyCoupon' })
	applyCouponId: ObjectId
}

export const NotificationCouponSchema = SchemaFactory.createForClass(NotificationCoupon)
