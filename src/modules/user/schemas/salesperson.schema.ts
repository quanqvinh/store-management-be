import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Gender } from '@/constants'
import { Auth } from './user.schema'

export type SalespersonDocument = Salesperson & Document

@Schema({ discriminatorKey: 'role', versionKey: false })
export class Salesperson {
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

export const SalespersonSchema = SchemaFactory.createForClass(Salesperson)
