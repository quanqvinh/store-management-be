import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId } from 'mongoose'
import { Auth } from '@/modules/auth/schemas/auth.schema'
import { Gender } from '@/constants'
import { MemberInfo, MemberInfoSchema } from './member-info.schema'
import { MemberHistoryDay, MemberHistoryDaySchema } from './member-history-day.schema'
import {
	Notification,
	NotificationSchema,
} from '@/modules/notification/schemas/notification.schema'

export type MemberDocument = Member & Document

@Schema({ versionKey: false, timestamps: { createdAt: 'joinedAt' } })
export class Member {
	_id: ObjectId

	@Prop({ type: String, required: true, unique: true })
	code: string

	@Prop({ type: String, required: true, unique: true })
	email: string

	@Prop({ type: String, required: true, unique: true })
	mobile: string

	@Prop({ type: Auth, required: true })
	auth: Auth

	@Prop({ type: String })
	avatar: string

	@Prop({ type: String, required: true })
	firstName: string

	@Prop({ type: String, required: true })
	lastName: string

	@Prop({ type: String, enum: Object.values(Gender) })
	gender: Gender

	@Prop({ type: Date })
	dob: Date

	@Prop({ type: Date })
	joinedAt: Date

	@Prop({ type: MemberInfoSchema, required: true })
	memberInfo: MemberInfo

	@Prop({ type: MemberHistoryDaySchema })
	specialDays: MemberHistoryDay

	@Prop([{ type: NotificationSchema }])
	notifications: Array<Notification>
}

export const MemberSchema = SchemaFactory.createForClass(Member)
