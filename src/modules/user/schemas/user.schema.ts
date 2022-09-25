import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type UserDocument = User & Document

@Schema({
	versionKey: false,
	id: false,
})
class Auth {
	@Prop({ type: String, require: true })
	password: string

	@Prop({ type: String, require: true, default: false })
	isVerified: boolean
}

@Schema({
	versionKey: false,
	timestamps: true,
})
export class User {
	@Prop({ type: String, unique: true, required: true })
	email: string

	@Prop({ type: String, required: true })
	avatar: string

	@Prop({ type: String, required: true })
	firstName: string

	@Prop({ type: String, required: true })
	lastName: string

	@Prop({ type: String, required: true })
	displayName: string

	@Prop({ type: String, unique: true })
	mobile: string

	@Prop({ type: String, unique: true })
	username: string

	@Prop({ type: Auth })
	auth: Auth

	@Prop({ type: Date })
	dob: Date

	@Prop({ type: String })
	bio: string

	@Prop({ type: String })
	address: string

	@Prop({ type: String })
	city: string

	@Prop({ type: String })
	country: string
}

export type UserInfo = Omit<User, 'auth'>

export const UserSchema = SchemaFactory.createForClass(User)
