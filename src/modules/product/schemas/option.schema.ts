import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false, _id: false })
export class Option {
	@Prop([{ type: { name: String, fee: Number } }])
	size: Array<{
		key: string
		name: string
		fee: number
	}>

	@Prop([{ type: { name: String, fee: Number } }])
	topping: Array<{
		name: string
		fee: number
	}>
}

export const OptionSchema = SchemaFactory.createForClass(Option)
