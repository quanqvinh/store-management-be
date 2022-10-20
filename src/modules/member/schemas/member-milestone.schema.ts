import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ versionKey: false, _id: false })
export class MemberMilestone {
	@Prop({ type: Types.ObjectId, required: true })
	memberType: Types.ObjectId

	@Prop({ type: Date, required: true })
	from: Date
}

export const MemberMilestoneSchema =
	SchemaFactory.createForClass(MemberMilestone)
