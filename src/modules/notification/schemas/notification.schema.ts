import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Document } from 'mongoose'
import { NotificationType } from '@/constants'

export type NotificationDocument = Notification & Document

@Schema({
	versionKey: false,
	discriminatorKey: 'type',
	timestamps: { createdAt: true },
})
export class Notification {
	_id: ObjectId

	@Prop({ type: String, required: true })
	title: string

	@Prop({ type: String, required: true })
	content: string

	@Prop({ type: String })
	image?: string

	@Prop({ type: String, enum: Object.values(NotificationType) })
	type?: NotificationType

	@Prop({ type: Boolean, required: true, default: false })
	checked: boolean

	createdAt: Date
}

export type NotificationContent = Pick<
	Notification,
	'title' | 'content' | 'image'
>

export const NotificationContentPropertyDefine = {
	title: { type: String, required: true },
	content: { type: String, required: true },
	image: { type: String },
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
