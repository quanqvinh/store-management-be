import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types } from 'mongoose'

@Schema({ versionKey: false, _id: false })
export class MemberInfo {
	@Prop({
		type: String,
		required: true,
		unique: true,
		set: (v: string) => v.toUpperCase(),
	})
	code: string

	@Prop({ type: Number, default: 0 })
	usedPoint: number

	@Prop({ type: Number, default: 0 })
	expiredPoint: number

	@Prop({ type: Number, default: 0 })
	currentPoint: number

	@Prop({ type: Types.ObjectId, ref: 'MemberRank', index: 1 })
	rank: ObjectId
}

export const MemberInfoSchema = SchemaFactory.createForClass(MemberInfo)

export interface MemberInfoVirtual {
	totalPoint: number
}

MemberInfoSchema.virtual('totalPoint').get(function () {
	return this.usedPoint + this.expiredPoint + this.currentPoint
})
