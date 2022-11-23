import { OrderType, Size } from '@/constants'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Types } from 'mongoose'

class IncludeCondition {
	size: Size
	amount: number
}

const IncludeConditionSchema = {
	sizeKey: { type: Number, default: Size.SMALL },
	amount: { type: Number, default: 1 },
}

export class IncludeProductCondition extends IncludeCondition {
	product?: ObjectId
}

const IncludeProductConditionSchema = {
	...IncludeConditionSchema,
	product: { type: Types.ObjectId, ref: 'Product' },
}

export class IncludeCategoryCondition extends IncludeCondition {
	category: ObjectId
}

const IncludeCategoryConditionSchema = {
	...IncludeConditionSchema,
	category: { type: Types.ObjectId, ref: 'Category', required: true },
}

@Schema({ versionKey: false, _id: false })
export class Condition {
	@Prop({ type: Number })
	minPrice?: number

	@Prop({ type: Number })
	minAmount?: number

	@Prop({ type: String, enum: Object.values(OrderType) })
	orderType?: OrderType

	@Prop({ type: [IncludeCategoryConditionSchema], _id: false })
	includeOneCategoryIn?: Array<IncludeCategoryCondition>

	@Prop({ type: [IncludeCategoryConditionSchema], _id: false })
	includeAllCategoryIn?: Array<IncludeCategoryCondition>

	@Prop({ type: [IncludeProductConditionSchema], _id: false })
	includeOneProductIn?: Array<IncludeProductCondition>

	@Prop({ type: [IncludeProductConditionSchema], _id: false })
	includeAllProductIn?: Array<IncludeProductCondition>
}

export const ConditionSchema = SchemaFactory.createForClass(Condition)
