import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Gender, UserRole } from '@/constants'

export type UserDocument = User & Document

@Schema({
	versionKey: false,
	_id: false,
})
export class Auth {
	@ApiProperty()
	@Prop({ type: String, required: true })
	password: string

	@ApiProperty()
	@Prop({ type: String, required: true, default: false })
	isVerified: boolean

	@ApiProperty()
	@Prop({ type: Number, required: true, default: Date.now() })
	validTokenTime: number
}

@Schema({
	discriminatorKey: 'role',
	versionKey: false,
	timestamps: true,
})
export class User {
	@ApiProperty()
	@Prop({ type: String, unique: true, required: true })
	email: string

	@ApiProperty()
	@Prop({ type: String })
	avatar: string

	@ApiProperty()
	@Prop({ type: String, required: true })
	firstName: string

	@ApiProperty()
	@Prop({ type: String, required: true })
	lastName: string

	@ApiProperty()
	@Prop({ type: Auth })
	auth: Auth

	@ApiProperty()
	@Prop({ type: String, enum: Object.values(Gender) })
	gender: Gender

	@ApiProperty()
	@Prop({ type: Date })
	dob: Date

	@ApiProperty()
	@Prop({
		type: String,
		enum: Object.values(UserRole),
	})
	role: string
}

export const UserSchema = SchemaFactory.createForClass(User)
