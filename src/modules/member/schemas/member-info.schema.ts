import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types } from 'mongoose'

@Schema({ versionKey: false, _id: false })
export class MemberInfo {
	@Prop({ type: Number, required: true, default: 0 })
	usedPoint: number

	@Prop({ type: Number, required: true, default: 0 })
	expiredPoint: number

	@Prop({ type: Number, required: true, default: 0 })
	currentPoint: number

	@Prop({ type: Types.ObjectId, required: true, ref: 'MemberType' })
	memberType: ObjectId
}

export const MemberInfoSchema = SchemaFactory.createForClass(MemberInfo)
