import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { envConfigLoad } from '@/config/env.config'

export type OtpTokenDocument = Document & OtpToken

@Schema({
	versionKey: false,
	timestamps: { createdAt: true },
	collection: 'otp_tokens',
})
export class OtpToken {
	@Prop({ type: String })
	email: string

	@Prop({
		type: String,
		required: true,
		unique: true,
	})
	value: string

	@Prop({
		type: String,
		required: true,
	})
	secret: string

	@Prop({
		type: Date,
		expires: envConfigLoad().otp.expire,
		required: true,
		default: Date.now(),
	})
	createdAt: Date
}

export const OtpTokenSchema = SchemaFactory.createForClass(OtpToken)
