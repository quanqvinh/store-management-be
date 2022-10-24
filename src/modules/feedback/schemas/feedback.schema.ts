import { Prop, Schema } from '@nestjs/mongoose'
import { ObjectId, Document } from 'mongoose'

export type FeedbackDocument = Document & Feedback

@Schema({ versionKey: false })
export class Feedback {
	_id: ObjectId

	@Prop({ type: String, required: true })
	content: string

	@Prop({ type: String, required: true, default: 'GUEST' })
	author: string

	@Prop({ type: String })
	authorAvatar: string
}
