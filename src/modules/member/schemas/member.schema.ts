import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Gender } from '@/constants'
import { Auth } from '@/modules/user/schemas/user.schema'

export type MemberDocument = Member & Document

@Schema({ discriminatorKey: 'role', versionKey: false })
export class Member {
	email: string
	avatar: string
	firstName: string
	lastName: string
	auth: Auth
	gender: Gender
	dob: Date
	role: string

	@Prop({ type: String, unique: true, required: true })
	mobile: string

	@Prop({ type: Types.ObjectId, ref: 'MemberType' })
	memberType: Types.ObjectId

	@Prop({ type: [String] })
	address: Array<string>
}

export type MemberInfo = Omit<Member, 'auth'>

export const MemberSchema = SchemaFactory.createForClass(Member)
