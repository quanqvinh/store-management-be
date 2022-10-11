import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Gender } from '@/constants'
import { Auth } from '@/modules/user/schemas/user.schema'

export type SalespersonDocument = Salesperson & Document

@Schema({ discriminatorKey: 'role', versionKey: false })
export class Salesperson {
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

export type SalespersonInfo = Omit<Salesperson, 'auth'>

export const SalespersonSchema = SchemaFactory.createForClass(Salesperson)
