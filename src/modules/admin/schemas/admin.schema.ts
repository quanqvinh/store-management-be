import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Gender } from '@/constants'
import { Auth } from '@/modules/user/schemas/user.schema'

export type AdminDocument = Admin & Document

@Schema({ versionKey: false })
export class Admin {
	email: string
	avatar: string
	firstName: string
	lastName: string
	auth: Auth
	gender: Gender
	dob: Date
	role: string

	@Prop({ type: String, unique: true, required: true })
	username: string
}

export type AdminInfo = Omit<Admin, 'auth'>

export const AdminSchema = SchemaFactory.createForClass(Admin)
