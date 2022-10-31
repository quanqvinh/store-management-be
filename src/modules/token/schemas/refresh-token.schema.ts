import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Types, Document, ObjectId } from 'mongoose'
import { envConfigLoad } from '@/config/env.config'

export type RefreshTokenDocument = Document & RefreshToken

@Schema({ versionKey: false, collection: 'refresh_tokens' })
export class RefreshToken {
	@Prop({ type: Types.ObjectId })
	uid: ObjectId

	@Prop({
		type: String,
		required: true,
		unique: true,
	})
	value: string

	@Prop({
		type: Boolean,
		default: false,
	})
	disabled: boolean

	@Prop({
		type: Date,
		expires: envConfigLoad().jwt.refreshToken.expire,
		required: true,
		default: Date.now(),
	})
	createdAt: Date
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)
