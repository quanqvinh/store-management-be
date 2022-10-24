import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId, Document } from 'mongoose'

export type RuleDocument = Rule & Document

@Schema({ versionKey: false })
export class Rule {
	_id: ObjectId

	@Prop({ type: String, required: true })
	name: string

	@Prop({ type: String, required: true })
	content: string
}

export const RuleSchema = SchemaFactory.createForClass(Rule)
