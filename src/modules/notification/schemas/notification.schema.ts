import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Document, Types } from 'mongoose'
import { NotificationType } from '@/constants'
import { PickType } from '@nestjs/swagger'

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

	@Prop({ type: Types.ObjectId })
	image?: ObjectId

	@Prop({ type: String, enum: Object.values(NotificationType) })
	type?: NotificationType

	@Prop({ type: Boolean, required: true, default: false })
	checked: boolean

	createdAt: Date
}

export class NotificationContent extends PickType(Notification, [
	'title',
	'content',
	'image',
]) {}

export const NotificationContentPropertyDefine = {
	title: { type: String, required: true },
	content: { type: String, required: true },
	image: { type: Types.ObjectId },
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
