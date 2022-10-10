import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Gender } from '@/constants'
import { Auth } from './user.schema'

export type MemberDocument = Member & Document

@Schema({ discriminatorKey: 'role', versionKey: false })
export class Member {
	email: string
	avatar: string
	firstName: string
	lastName: string
	username: string
	auth: Auth
	gender: Gender
	dob: Date
	role: string

	@Prop({ type: String, unique: true })
	mobile: string

	@Prop({
		type: Types.ObjectId,
		ref: 'MemberType',
	})
	memberType: Types.ObjectId

	@Prop({ type: [String] })
	address: Array<string>
}

export const MemberSchema = SchemaFactory.createForClass(Member)
