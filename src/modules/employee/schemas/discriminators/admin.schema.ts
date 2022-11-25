import { EmployeeRole } from '@/constants'
import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Employee } from '../employee.schema'

export type AdminDocument = Admin & Employee & Document

@Schema({ versionKey: false })
export class Admin {
	type: EmployeeRole
}

export const AdminSchema = SchemaFactory.createForClass(Admin)
