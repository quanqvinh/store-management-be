import { Prop, Schema } from '@nestjs/mongoose'

@Schema({
	versionKey: false,
	_id: false,
})
export class Auth {
	@Prop({ type: String, required: true })
	password: string

	@Prop({ type: Boolean, required: true, default: false })
	isVerified: boolean

	@Prop({ type: Number, required: true, default: Date.now(), expires: 30 })
	validTokenTime: number
}
