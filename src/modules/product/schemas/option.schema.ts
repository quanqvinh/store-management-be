import { Size } from '@/constants'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export class SizeOption {
	size: Size
	fee: number
}

const SizeOptionSchema = {
	size: { type: String, enum: Object.values(Size) },
	fee: { type: Number, required: true },
}

export class ToppingOption {
	name: string
	fee: number
}

const ToppingOptionSchema = {
	name: { type: String, required: true },
	fee: { type: Number, required: true },
}

@Schema({ versionKey: false, _id: false })
export class Option {
	@Prop([{ type: SizeOptionSchema }])
	size: Array<SizeOption>

	@Prop([{ type: ToppingOptionSchema }])
	topping: Array<ToppingOption>
}

export const OptionSchema = SchemaFactory.createForClass(Option)
