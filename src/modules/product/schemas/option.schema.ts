import { Size } from '@/constants'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import slugGenerator from 'mongoose-slug-generator'

export class SizeOption {
	size: Size
	cost: number
}

export const SizeOptionSchema = {
	size: { type: String, enum: Object.values(Size) },
	cost: { type: Number, required: true },
}

export class ToppingOption {
	name: string
	cost: number
}

export const ToppingOptionSchema = {
	name: { type: String, required: true },
	cost: { type: Number, required: true },
}

@Schema({ versionKey: false, _id: false })
export class Option {
	@Prop([{ type: SizeOptionSchema }])
	size: Array<SizeOption>

	@Prop([{ type: ToppingOptionSchema }])
	topping: Array<ToppingOption>
}

export const OptionSchema = SchemaFactory.createForClass(Option)

OptionSchema.plugin(slugGenerator)
