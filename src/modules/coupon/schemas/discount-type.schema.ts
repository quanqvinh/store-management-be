import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false, _id: false })
export class DiscountType {
	@Prop({ type: Number })
	percentage: number

	@Prop({ type: Number })
	decrease: number

	@Prop({ type: Number })
	price: number

	@Prop({ type: Boolean })
	freeMin: boolean
}

export const DiscountTypeSchema = SchemaFactory.createForClass(DiscountType)
