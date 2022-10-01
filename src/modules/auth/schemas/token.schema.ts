import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { RefreshToken } from './refresh-token.schema'

export type TokenDocument = Document & Token

@Schema({
	versionKey: false,
	discriminatorKey: 'type',
})
export class Token {
	@Prop({ type: Types.ObjectId })
	uid: Types.ObjectId

	@Prop({
		type: String,
		required: true,
		unique: true,
	})
	value: string

	@Prop({
		type: String,
		enum: [RefreshToken.name],
		required: true,
		default: RefreshToken.name,
	})
	type: string
}

export const TokenSchema = SchemaFactory.createForClass(Token)
