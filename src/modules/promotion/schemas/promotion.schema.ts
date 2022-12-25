import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, ObjectId, Document } from 'mongoose'
import mongooseDelete from 'mongoose-delete'

export type PromotionDocument = Document & Promotion

export class PromotionPrivilege {
	applyTo: ObjectId
	beginTime: Date
	endTime?: Date
	limit?: number
	sold?: number
}

@Schema({ versionKey: false, timestamps: true })
export class Promotion {
	_id?: ObjectId

	@Prop({ type: String, required: true, index: 'text' })
	title: string

	@Prop({ type: String })
	description?: string

	@Prop({
		type: Types.ObjectId,
		ref: 'Coupon',
		required: true,
	})
	coupon: ObjectId

	@Prop({ type: Number, required: true })
	cost: number

	@Prop({
		type: [
			{
				applyTo: { type: Types.ObjectId, required: true, ref: 'MemberRank' },
				beginTime: { type: Date, required: true },
				endTime: { type: Date },
				limit: { type: Number, default: 0 },
				sold: { type: Number, default: 0 },
			},
		],
		required: true,
		_id: false,
	})
	privilege: Array<PromotionPrivilege>

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'Member' }],
		_id: false,
		default: [],
	})
	ignoreMembers: Types.ObjectId[]

	@Prop({ type: Boolean, default: false })
	opening: boolean

	@Prop({ type: Types.ObjectId })
	disableFlag?: ObjectId | string

	createAt?: Date
	updatedAt?: Date
	deleted?: boolean
	deletedAt?: Date
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion)

PromotionSchema.plugin(mongooseDelete, { deletedAt: true })
