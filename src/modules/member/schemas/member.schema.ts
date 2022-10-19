import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Auth } from '@/modules/auth/schemas/auth.schema'
import { Gender } from '@/constants'
import { ChangeFields } from '@/types'

export type MemberDocument = Member & Document

@Schema({ versionKey: false, _id: false })
export class MemberMilestone {
	@Prop({ type: Types.ObjectId, required: true })
	memberType: Types.ObjectId

	@Prop({ type: Date, required: true })
	from: Date
}

@Schema({ versionKey: false, _id: false })
export class MemberInfo {
	@Prop({ type: Number, required: true, default: 0 })
	usedPoint: number

	@Prop({ type: Number, required: true, default: 0 })
	expiredPoint: number

	@Prop({ type: Number, required: true, default: 0 })
	currentPoint: number

	@Prop({ type: Array<MemberMilestone>, required: true })
	memberMilestone: Array<MemberMilestone>
}

@Schema({ versionKey: false, timestamps: { createdAt: 'joinedAt' } })
export class Member {
	_id: Types.ObjectId

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

	@Prop({ type: MemberInfo, required: true })
	memberInfo: MemberInfo
}

export type MemberInsensitiveData = ChangeFields<
	Member,
	{
		auth: Pick<Auth, 'isVerified'>
	}
>

export const MemberSchema = SchemaFactory.createForClass(Member)
