import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Types, Document } from 'mongoose'
import { envConfigLoad } from '@/config/env.config'

const env = envConfigLoad({ load: true })

export type RefreshTokenDocument = Document & RefreshToken

@Schema({ versionKey: false })
export class RefreshToken {
	uid: Types.ObjectId
	value: string
	type: string

	@Prop({
		type: Boolean,
		default: false,
	})
	disabled: boolean

	@Prop({
		type: Date,
		expires: env.jwt.refreshToken.expire,
		required: true,
		default: Date.now(),
	})
	createdAt: Date
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)
