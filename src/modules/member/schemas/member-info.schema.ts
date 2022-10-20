import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {
	MemberMilestone,
	MemberMilestoneSchema,
} from './member-milestone.schema'



@Schema({ versionKey: false, _id: false })
export class MemberInfo {
	@Prop({ type: Number, required: true, default: 0 })
	usedPoint: number

	@Prop({ type: Number, required: true, default: 0 })
	expiredPoint: number

	@Prop({ type: Number, required: true, default: 0 })
	currentPoint: number

	@Prop({ type: [MemberMilestoneSchema], required: true })
	memberMilestone: [MemberMilestone]
}

export const MemberInfoSchema = SchemaFactory.createForClass(MemberInfo)

MemberInfoSchema.virtual('currentType').get(function () {
	return this.memberMilestone[0].memberType
})
