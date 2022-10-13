import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Gender } from '@/constants'
import { Auth } from '@/modules/user/schemas/user.schema'
import { ApiProperty } from '@nestjs/swagger'

export type SalespersonDocument = Salesperson & Document

@Schema({ discriminatorKey: 'role', versionKey: false })
export class Salesperson {
	@ApiProperty()
	email: string
	@ApiProperty()
	avatar: string
	@ApiProperty()
	firstName: string
	@ApiProperty()
	lastName: string
	@ApiProperty()
	auth: Auth
	@ApiProperty()
	gender: Gender
	@ApiProperty()
	dob: Date
	@ApiProperty()
	role: string

	@ApiProperty()
	@Prop({ type: String, unique: true, required: true })
	username: string
}

export type SalespersonInfo = Omit<Salesperson, 'auth'>

export const SalespersonSchema = SchemaFactory.createForClass(Salesperson)
