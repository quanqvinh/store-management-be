import { EmployeeRole } from '@/constants'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export type SalespersonDocument = Salesperson & Document

@Schema({ versionKey: false })
export class Salesperson {
	role: EmployeeRole

	@Prop({ type: Types.ObjectId, ref: 'Store' })
	store?: Types.ObjectId
}

export const SalespersonSchema = SchemaFactory.createForClass(Salesperson)
