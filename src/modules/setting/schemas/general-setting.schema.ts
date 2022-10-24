import { Setting } from './setting.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ContactType, SettingType } from '@/constants'

export type GeneralSettingDocument = Document & GeneralSetting

type Contact = {
	icon: string
	name: string
	type: ContactType
	info: string
}
const ContactDefine = {
	icon: { type: String },
	name: { type: String, required: true },
	type: {
		type: String,
		enum: Object.values(ContactType),
		default: ContactType.WEBSITE,
	},
}

@Schema({ versionKey: false })
export class GeneralSetting extends Setting {
	type: SettingType.GENERAL

	@Prop({ type: String })
	brandName: string

	@Prop({ type: ContactDefine })
	contact: Contact
}

export const GeneralSettingSchema = SchemaFactory.createForClass(GeneralSetting)
