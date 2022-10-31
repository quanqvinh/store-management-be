import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type Size = {
	key: string
	name: string
	fee: number
}

const SizeSchema = {
	key: { type: String },
	name: { type: String, required: true },
	fee: { type: Number, required: true },
}

export type Topping = {
	name: string
	fee: number
}

const ToppingSchema = {
	name: { type: String, required: true },
	fee: { type: Number, required: true },
}

@Schema({ versionKey: false, _id: false })
export class Option {
	@Prop([{ type: SizeSchema }])
	size: Array<Size>

	@Prop([{ type: ToppingSchema }])
	topping: Array<Topping>
}

export const OptionSchema = SchemaFactory.createForClass(Option)
