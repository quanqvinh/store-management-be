import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Gender } from '@/constants'
import { Auth } from '@/modules/user/schemas/user.schema'
import { ChangeFields } from '@/types'
import { ApiProperty } from '@nestjs/swagger'

export type MemberDocument = Member & Document

@Schema({ discriminatorKey: 'role', versionKey: false })
export class Member {
	@ApiProperty()
	email: string
	@ApiProperty()
	avatar: string
	@ApiProperty()
	firstName: string
	@ApiProperty()
	lastName: string
	@ApiProperty()
	auth: Auth
	@ApiProperty()
	gender: Gender
	@ApiProperty()
	dob: Date
	@ApiProperty()
	role: string

	@ApiProperty()
	@Prop({ type: String, required: true })
	mobile: string

	@ApiProperty()
	@Prop({ type: Types.ObjectId, ref: 'MemberType' })
	memberType: Types.ObjectId

	@ApiProperty()
	@Prop({ type: [String] })
	address: Array<string>
}

export type MemberInsensitiveData = ChangeFields<
	Member,
	{
		auth: Pick<Auth, 'isVerified'>
	}
>

export const MemberSchema = SchemaFactory.createForClass(Member)
