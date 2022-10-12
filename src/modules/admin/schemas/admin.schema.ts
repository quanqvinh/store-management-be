import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Gender } from '@/constants'
import { Auth } from '@/modules/user/schemas/user.schema'
import { ApiProperty } from '@nestjs/swagger'
import { ChangeFields } from '@/types'

export type AdminDocument = Admin & Document

@Schema({ versionKey: false })
export class Admin {
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
	@Prop({ type: String, unique: true, required: true })
	username: string
}

export type AdminInsensitiveData = ChangeFields<
	Admin,
	{
		auth: Pick<Auth, 'isVerified'>
	}
>

export const AdminSchema = SchemaFactory.createForClass(Admin)
