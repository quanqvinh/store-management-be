import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Gender, EmployeeRole } from '@/constants'
import { Auth } from '@/modules/auth/schemas/auth.schema'

export type EmployeeDocument = Employee & Document

@Schema({ versionKey: false, timestamps: { createdAt: 'joinedAt' } })
export class Employee {
	_id: Types.ObjectId

	@Prop({ type: String, required: true, unique: true })
	username: string

	@Prop({ type: Auth, required: true })
	auth: Auth

	@Prop({ type: String, required: true, unique: true })
	email: string

	@Prop({ type: String, enum: Object.values(EmployeeRole), required: true })
	role: string

	@Prop({ type: String })
	avatar: string

	@Prop({ type: String })
	name: string

	@Prop({ type: String })
	mobile: string

	@Prop({ type: String, enum: Object.values(Gender) })
	gender: Gender

	@Prop({ type: Date })
	dob: Date

	joinedAt: Date
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee)
