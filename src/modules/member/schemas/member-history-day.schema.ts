import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ versionKey: false, _id: false })
export class MemberHistoryDay {
	@Prop({ type: Date })
	dateOfBirth: Date

	@Prop({ type: Date })
	firstOrder: Date

	@Prop([
		{
			type: Types.Map,
			of: {
				name: { type: String, required: true },
				date: { type: Date, required: true },
			},
		},
	])
	stores: Record<
		string,
		{
			name: string
			date: Date
		}
	>

	@Prop([
		{
			type: Types.Map,
			of: {
				name: { type: String, required: true },
				date: { type: Date, required: true },
			},
		},
	])
	memberRank: Record<
		string,
		{
			name: string
			date: Date
		}
	>
}

export const MemberHistoryDaySchema = SchemaFactory.createForClass(MemberHistoryDay)
