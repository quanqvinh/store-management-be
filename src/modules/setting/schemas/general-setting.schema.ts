import { Setting } from './setting.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { SettingType } from '@/constants'

export type GeneralSettingDocument = Document & GeneralSetting

@Schema({ versionKey: false })
export class GeneralSetting extends Setting {
	type: SettingType.GENERAL

	@Prop({ type: String })
	brandName: string

	@Prop({ type: String })
	switchBoard: string

	@Prop({ type: String })
	email: string
}

export const GeneralSettingSchema = SchemaFactory.createForClass(GeneralSetting)
