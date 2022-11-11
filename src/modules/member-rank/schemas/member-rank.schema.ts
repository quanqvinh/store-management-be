import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Document, Types } from 'mongoose'

export type MemberRankDocument = MemberRank & Document

@Schema({ versionKey: false, collection: 'member_ranks' })
export class MemberRank {
	_id: ObjectId

	@Prop({ type: String, required: true })
	name: string

	@Prop({ type: Number, required: true, index: true, min: 0 })
	rank: number

	@Prop({
		type: {
			icon: { type: String },
			color: { type: String },
			background: { type: String },
		},
		required: true,
		_id: false,
	})
	display: {
		icon: string
		color: string
		background: string
	}

	@Prop({ type: Number, required: true, min: 0, default: 0 })
	condition: number

	@Prop({ type: Number, required: true, min: 1, default: 1 })
	coefficientPoint: number

	@Prop({ type: [Types.ObjectId], ref: 'Coupon' })
	coupons: Array<ObjectId>

	@Prop({ type: [Types.ObjectId], ref: 'Gift' })
	gifts: Array<ObjectId>
}

export const MemberRankSchema = SchemaFactory.createForClass(MemberRank)
