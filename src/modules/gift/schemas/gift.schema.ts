import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, ObjectId, Document } from 'mongoose'
import { Coupon, CouponSchema } from '@/modules/coupon/schemas/coupon.schema'

export type GiftDocument = Document & Gift

@Schema({ versionKey: false })
export class Gift {
	_id: ObjectId

	@Prop({ type: String, required: true })
	title: string

	@Prop({ type: CouponSchema, required: true })
	coupon: Coupon

	@Prop({
		type: {
			base: { type: String, required: true },
			id: { type: Types.ObjectId },
		},
		required: true,
	})
	startDay: {
		base: string
		id: ObjectId
	}
}

export const GiftDocument = SchemaFactory.createForClass(Gift)
