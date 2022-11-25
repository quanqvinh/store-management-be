import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId } from 'mongoose'
import { EmployeeRole } from '@/constants'
import { Auth } from '@/modules/auth/schemas/auth.schema'

export type EmployeeDocument = Employee & Document

@Schema({
	versionKey: false,
	timestamps: { createdAt: 'joinedAt' },
	discriminatorKey: 'role',
})
export class Employee {
	_id: ObjectId

	@Prop({ type: String, required: true, unique: true })
	username: string

	@Prop({ type: Auth, required: true })
	auth: Auth

	@Prop({ type: String, enum: Object.values(EmployeeRole), required: true })
	role: string

	@Prop({ type: Date })
	joinedAt?: Date
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee)
