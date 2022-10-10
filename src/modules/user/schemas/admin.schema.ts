import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Gender } from '@/constants'
import { Auth } from './user.schema'

export type AdminDocument = Admin & Document

@Schema({ discriminatorKey: 'role', versionKey: false })
export class Admin {
	email: string
	avatar: string
	firstName: string
	lastName: string
	username: string
	auth: Auth
	gender: Gender
	dob: Date
	role: string
}

export const AdminSchema = SchemaFactory.createForClass(Admin)
